from __future__ import annotations

import pandas as pd
from sentence_transformers import SentenceTransformer

from app.store import store_datasets


def preprocess_xsls(file_paths):
    """
    Preprocesses uploaded XLSX files and creates embeddings.

    Parameters:
    - file_paths: List of file paths to the uploaded XLSX files.
    """
    str_list = []

    # Initialize the sentence transformer model
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Read XLSX files and convert to strings
    for file_path in file_paths:
        df_xlsx = pd.read_excel(file_path, header=None)
        str_list.extend(df_to_str_list(df_xlsx))
        str_list.extend(df_transposed_to_str_list(df_xlsx.T))

    # Create embeddings
    embeddings = model.encode(str_list, convert_to_numpy=True)
    store_datasets(str_list, embeddings)
    print(f"Added embeddings of shape {embeddings.shape} to the store.")


def df_to_str_list(df) -> list[str]:
    """
    Converts a DataFrame to a list of strings.

    Parameters:
    - df: The DataFrame to convert.

    Returns:
    - text_list: List of strings from the DataFrame.
    """
    row1 = df.iloc[0].to_list()
    row2 = df.iloc[1].to_list()

    def flatten_tuple(t):
        t = [str(x) for x in t if pd.notna(x)]
        return " ".join(t).strip()

    def flatten_row(row):
        list_of_tuples = zip(row1, row2, row.to_list())
        list_of_str = [flatten_tuple(x) for x in list_of_tuples]
        return ";".join(list_of_str)

    start_row = 4
    str_list = df.iloc[start_row:].apply(flatten_row, axis=1).to_list()
    return str_list


def df_transposed_to_str_list(df) -> list[str]:
    """
    Converts a transposed DataFrame to a list of strings.

    Parameters
    - df: The transposed DataFrame to convert.

    Returns:
    - text_list: List of strings from the transposed DataFrame.
    """
    row1 = df.iloc[0].to_list()

    def flatten_tuple(t):
        t = [str(x) for x in t if pd.notna(x)]
        return " ".join(t).strip()

    def flatten_row(row):
        list_of_tuples = zip(row1, row.to_list())
        list_of_str = [flatten_tuple(x) for x in list_of_tuples]
        return ";".join(list_of_str)

    start_row = 2

    str_list = df.iloc[start_row:].apply(flatten_row, axis=1).to_list()
    return str_list
