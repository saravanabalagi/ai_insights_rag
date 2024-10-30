from __future__ import annotations

import os
from pathlib import Path

from fastapi import APIRouter, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.llm import query_llm
from app.preprocess import preprocess_xsls
from app.store import store

app = FastAPI()
router = APIRouter()
data_dir = Path("/data")
disk_default_dir = data_dir / "default"
disk_custom_dir = data_dir / "custom"


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


@router.get("/data/{filepath:path}")
async def get_data(filepath: str):
    path_full = data_dir / filepath
    if path_full.is_dir():
        files = path_full.glob("*")
        files = [str(p.relative_to(path_full)) for p in files]
        files = [f for f in files if not f.startswith(".")]
        return {"files": files}
    if not path_full.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=path_full,
        filename=path_full.name,
        media_type="application/octet-stream",
    )


@router.post("/query/")
async def query(q: Query):
    if not q.msg:
        return {"response": "Please provide a msg in request body."}

    return query_llm(q.msg, q.rag_type)


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
    print(f"Preprocessed {len(xlsx_files)} files in default directory completed")


app.include_router(router, prefix="/api")
load_data_from_default_disk()
