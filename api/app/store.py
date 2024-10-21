import os

import faiss

from app.constants import models

store = {
    "model": os.getenv("TOGETHERAI_MODEL"),
    "api_key": os.getenv("TOGETHERAI_API_KEY"),
    "models": models,
    "datasets": {
        "embeddings": None,
        "faiss_index": None,
        "str_list": [],
    },
}


def store_datasets(str_list, embeddings):
    """
    Stores the preprocessed str_list and embeddings.
    Also calculates and stores the FAISS index.

    Parameters:
    - str_list: List of strings from the DataFrames.
    - embeddings: Numpy array of embeddings for all combined datasets.
    """
    global store
    ds = store["datasets"]

    ds["str_list"] = str_list
    ds["embeddings"] = embeddings

    # Initialize or update FAISS index
    dimension = embeddings.shape[1]
    ds["faiss_index"] = faiss.IndexFlatL2(dimension)
    ds["faiss_index"].add(embeddings)


def clear_datasets():
    """
    Clears all stored datasets and related information.
    """
    global store
    store["datasets"] = {
        "embeddings": None,
        "faiss_index": None,
        "str_list": [],
    }
