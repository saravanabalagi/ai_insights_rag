import faiss
import numpy as np

# Global variables to store datasets and related information
store = {
    "data_frames": [],
    "faiss_index": None,
    "embeddings": None,
    "metadata": [],
}


def store_datasets(data_frames, embeddings, metadata):
    """
    Stores the preprocessed DataFrames, embeddings, and metadata.

    Parameters:
    - data_frames: List of pandas DataFrames that have been cleaned and preprocessed.
    - embeddings: Numpy array of embeddings for all combined datasets.
    - metadata: List of metadata dictionaries corresponding to each DataFrame.
    """
    global store

    store["data_frames"] = data_frames
    store["embeddings"] = embeddings
    store["metadata"] = metadata

    # Initialize or update FAISS index
    dimension = embeddings.shape[1]
    store["faiss_index"] = faiss.IndexFlatL2(dimension)
    store["faiss_index"].add(embeddings)


def get_datasets():
    """
    Retrieves the stored datasets and related information.

    Returns:
    - datasets: Dictionary containing 'data_frames', 'faiss_index', 'embeddings',
        and 'metadata'.
    """
    return store


def add_dataset(data_frame, embedding, metadata):
    """
    Adds a new dataset to the existing datasets.

    Parameters:
    - data_frame: The pandas DataFrame to add.
    - embedding: Numpy array of embeddings corresponding to the DataFrame's text data.
    - metadata: Metadata dictionary for the DataFrame.
    """
    global store

    store["data_frames"].append(data_frame)
    store["metadata"].append(metadata)

    # Update embeddings
    if store["embeddings"] is not None:
        store["embeddings"] = np.vstack((store["embeddings"], embedding))
    else:
        store["embeddings"] = embedding

    # Update FAISS index
    if store["faiss_index"] is None:
        dimension = embedding.shape[1]
        store["faiss_index"] = faiss.IndexFlatL2(dimension)
    store["faiss_index"].add(embedding)


def clear_datasets():
    """
    Clears all stored datasets and related information.
    """
    global store
    store["data_frames"] = []
    store["faiss_index"] = None
    store["embeddings"] = None
    store["metadata"] = []
