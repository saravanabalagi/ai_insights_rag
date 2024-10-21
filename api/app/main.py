from __future__ import annotations

import os
from pathlib import Path

from fastapi import APIRouter, FastAPI, File, UploadFile
from pydantic import BaseModel

from app.constants import models
from app.llm import query_llm
from app.preprocess import preprocess_xsls

app = FastAPI()
router = APIRouter()
data_dir = Path("/data")
disk_default_dir = data_dir / "default"
disk_custom_dir = data_dir / "custom"

store = {
    "model": os.getenv("TOGETHERAI_MODEL"),
    "api_key": os.getenv("TOGETHERAI_API_KEY"),
    "models": models,
}


class Query(BaseModel):
    msg: str
    rag_type: str


class Model(BaseModel):
    model: str
    api_key: str | None = None


@router.post("/upload")
async def upload_file(file: UploadFile = None):
    if file is None:
        file = File(...)
    try:
        file_path = disk_custom_dir / file.filename
        async with file_path.open("wb") as f:
            f.write(await file.read())
    except OSError as e:
        return {"status": "error", "message": str(e)}
    return {"status": "success", "file": file.filename}


@router.get("/paths/default/")
async def paths_default():
    paths = list(disk_default_dir.glob("*.xlsx"))
    paths = [str(path.relative_to(disk_default_dir)) for path in paths]
    return {"paths": paths}


@router.get("/paths/custom/")
async def paths_custom():
    paths = list(disk_custom_dir.glob("*.xlsx"))
    paths = [str(path.relative_to(disk_custom_dir)) for path in paths]
    return {"paths": paths}


@router.post("/query/")
async def query(q: Query):
    if not q.msg:
        return {"response": "Please provide a msg in request body."}

    response_text = query_llm(q.msg, q.rag_type)
    return {"response": response_text}


@router.get("/models/")
async def model():
    return {"models": store["models"], "model": store["model"]}


@router.post("/models/")
async def select_model(m: Model):
    if model != os.getenv("TOGETHERAI_MODEL") and m.api_key is None:
        return {"message": "Please provide an API key."}
    store["api_key"] = m.api_key
    store["model"] = m.model
    return await model()


@router.get("/")
async def root():
    return {"message": "Welcome to the AI Data Insights API!"}


def load_data_from_default_disk():
    xlsx_files = list(disk_default_dir.glob("*.xlsx"))
    print(f"Found {len(xlsx_files)} files. Preprocessing...")
    preprocess_xsls(xlsx_files)
    print(f"Preprocessed {len(xlsx_files)} files in default directory")


app.include_router(router, prefix="/api")
load_data_from_default_disk()
