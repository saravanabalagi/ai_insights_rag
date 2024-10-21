import pandas as pd
from sentence_transformers import SentenceTransformer

from app.store import store_datasets


def preprocess_xsls(file_paths):
    """
    Preprocesses uploaded XLSX files and creates embeddings.

    Parameters:
    - file_paths: List of file paths to the uploaded XLSX files.

    Returns:
    - index: FAISS index containing embeddings of the combined datasets.
    - data_frames: List of cleaned pandas DataFrames corresponding to the uploaded files
    """
    combined_texts = []
    data_frames = []

    # Initialize the sentence transformer model
    model = SentenceTransformer("all-MiniLM-L6-v2")

    for file_path in file_paths:
        # Load the XLSX file
        df_xlsx = pd.read_excel(file_path)

        # Clean the DataFrame
        df_clean = df_xlsx.copy()

        # Identify and skip irrelevant header rows
        # e.g., skip rows with 'Unnamed' in columns
        header_row_index = 0
        for i, row in df_xlsx.iterrows():
            if "Unnamed" not in "".join(map(str, row.values)):
                header_row_index = i
                break
        df_clean = pd.read_excel(file_path, header=header_row_index)

        # Fill NaN values in column names
        df_clean.columns = [
            str(col) if not pd.isna(col) else f"Unnamed_{i}"
            for i, col in enumerate(df_clean.columns)
        ]

        # Convert percentage strings to numeric values
        for col in df_clean.columns:
            if df_clean[col].dtype == object:
                df_clean[col] = df_clean[col].astype(str).str.replace("%", "")
                df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")

        # Handle missing values
        df_clean = df_clean.fillna("")

        # Create a combined text column for embeddings
        text_columns = df_clean.select_dtypes(include=["object"]).columns
        df_clean["Combined_Text"] = df_clean[text_columns].apply(
            lambda x: " ".join(x.to_numpy().astype(str)),
            axis=1,
        )

        # Append combined texts for embedding
        combined_texts.extend(df_clean["Combined_Text"].tolist())
        data_frames.append(df_clean)

    # Create embeddings
    embeddings = model.encode(combined_texts, convert_to_numpy=True)
    store_datasets(data_frames, embeddings, None)
    print(f"Added {len(data_frames)} datasets to the store.")
    print(f"Added embeddings of shape {embeddings.shape} to the store.")
