import os

from sentence_transformers import SentenceTransformer
from together import Together

from app.store import get_datasets


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
    store = get_datasets()
    faiss_index = store["faiss_index"]
    data_frames = store["data_frames"]
    embeddings = store["embeddings"]

    if faiss_index is None or embeddings is None:
        return "No datasets are currently available. Please upload datasets first."

    # Initialize the sentence transformer model (ensure same model used for embeddings)
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Create embedding for the user's query
    query_embedding = model.encode([user_query], convert_to_numpy=True)

    # Perform similarity search using FAISS
    k = 5  # Number of nearest neighbors to retrieve
    distances, indices = faiss_index.search(query_embedding, k)

    # Retrieve relevant data based on indices
    relevant_texts = []
    for idx in indices[0]:
        # Determine which DataFrame the index corresponds to
        cumulative_lengths = [0]
        total_length = 0
        for df_i in data_frames:
            total_length += len(df_i)
            cumulative_lengths.append(total_length)

        # Find the DataFrame and row index
        for i in range(len(cumulative_lengths) - 1):
            if cumulative_lengths[i] <= idx < cumulative_lengths[i + 1]:
                df_i = data_frames[i]
                row_idx = idx - cumulative_lengths[i]
                relevant_text = df_i.iloc[row_idx]["Combined_Text"]
                relevant_texts.append(relevant_text)
                break

    # Prepare the prompt for the language model
    context = "\n".join(relevant_texts)
    prompt = f"Context:\n{context}\n\nQuestion:\n{user_query}\n\nAnswer:"

    # Query the Together.ai language model
    response_text = generate_ai_response(prompt)

    return response_text


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
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    return response.choices[0].message.content
