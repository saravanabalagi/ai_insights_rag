import os

from fastapi.responses import StreamingResponse
from sentence_transformers import SentenceTransformer
from together import Together

from app.store import store


def query_llm(user_query, rag_type):
    """
    Processes the user's query, retrieves relevant data using FAISS,
    and generates AI-powered insights using the Together.ai language model.

    Parameters:
    - user_query: The query string input by the user.
    - rag_type: [default, custom, none] Which RAG disk to use

    Returns:
    - response_text: The generated response from the language model.
    """

    if rag_type == "none":
        return generate_ai_response(user_query)

    # Retrieve datasets and FAISS index
    ds = store["datasets"]
    str_list = ds["str_list"]
    embeddings = ds["embeddings"]
    faiss_index = ds["faiss_index"]

    if faiss_index is None or embeddings is None:
        return "No datasets are currently available. Please upload datasets first."

    # Initialize the sentence transformer model (ensure same model used for embeddings)
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Create embedding for the user's query
    query_embedding = model.encode([user_query], convert_to_numpy=True)

    # Perform similarity search using FAISS
    k = 5  # Number of nearest neighbors to retrieve
    _, indices = faiss_index.search(query_embedding, k)

    # Get the corresponding text snippets from str_list
    context_snippets = [str_list[idx] for idx in indices[0]]
    if not context_snippets:
        print("No similar context found.")
        print(f'Query: "{user_query}"')
        print(f"Indices: {indices[0]}")
    context = "\n".join(context_snippets)

    prompt = f"Context:\n{context}\n\nQuestion:\n{user_query}\n\nAnswer:"

    # Query the Together.ai language model
    return generate_ai_response(prompt)


def generate_ai_response(prompt: str):
    """
    Sends the prompt to the Together.ai API and retrieves the generated response.

    Parameters:
    - prompt: The prompt string to send to the language model.

    Returns:
    - response_text: The generated response from the language model.
    """
    api_key = os.getenv("TOGETHERAI_API_KEY")
    model = os.getenv("TOGETHERAI_MODEL")

    client = Together(api_key=api_key)
    stream = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        stream=True,
    )

    # Define a generator that yields each chunk of content
    def event_generator():
        for chunk in stream:
            # Extract the content from the chunk
            choices = chunk.choices
            if not choices:
                continue
            content = chunk.choices[0].delta.content or ""
            if content:
                yield content

    # return streaming response
    return StreamingResponse(event_generator(), media_type="text/plain")
