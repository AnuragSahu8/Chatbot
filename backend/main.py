from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import typing
from typing import Any


from fastapi import FastAPI, UploadFile, File, HTTPException,Form
import uvicorn
from pathlib import Path
import PyPDF2  # for PDF handling
import docx  # for DOCX handling
import io
import os
import pandas as pd
import re
import google.generativeai as genai

# Load environment variables from .env file (if any)
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class Response(BaseModel):
    result: str | None
    

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:3001"
]

app = FastAPI()

ALLOWED_EXTENSIONS = {".txt", ".docx", ".pdf", ".csv"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB in bytes


def validate_filename(filename: str):
    """
    Checks if the uploaded file has an allowed extension.
    """
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=415, detail=f"Unsupported file format. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}")

def get_gemini_response(input, text):
    input_prompt = f"""
    Based on the given text below your task is to answer the User's question.
    {text}
    Human Question={input}
    """
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(input_prompt)
    cleaned_text = re.sub(r'\+', '', response.text)
    return cleaned_text

class Response(BaseModel):
    result: str

@app.post("/predict", response_model=Response)
async def predict(question: str = Form(...), file: UploadFile = File(None)):
    """
    Generates a response using Gemini, optionally incorporating text from an uploaded file.
    """
    text = None
    if file:
        try:
            extracted_text = await upload_file(file)  # Call the upload_file function for text extraction
            text = extracted_text["text"]
        except HTTPException as e:
            return Response(result=f"Error processing file: {e.detail}")
    else:
        raise HTTPException(status_code=400, detail="Please select a file!")

    response = get_gemini_response(question, text)
    return Response(result=response)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Uploads a file and extracts the text content based on its extension.
    """
    validate_filename(file.filename)

    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File size exceeded. Maximum allowed size: {MAX_FILE_SIZE // (1024 * 1024)} MB")

    content = await file.read()

    if file.content_type == "text/plain":
        text = content.decode("utf-8")  # Assuming UTF-8 encoding for text files

    elif file.filename.endswith((".docx", ".doc")):
        document = docx.Document(io.BytesIO(content))  # Use the UploadFile content directly
        text = ""
        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"  # Extract text from each paragraph

    elif file.filename.endswith(".pdf"):
        try:
            reader=PyPDF2.PdfReader(io.BytesIO(content))
            text=""
            for page in range(len(reader.pages)):
                page=reader.pages[page]
                text+=str(page.extract_text())
        except PyPDF2.errors.PdfReadError:
            raise HTTPException(status_code=500, detail="Invalid PDF format")

    elif file.filename.endswith(".csv"):
        print(file.filename)
            # content = await file.read()
            # text = ""
        df = pd.read_csv(io.BytesIO(content))
        text = str(df)
        # Wrap the decoded string in io.StringIO to create a file-like object
        # csv_buffer = io.BytesIO(csv_data)
        # Read the CSV data using Pandas
        # df = pd.read_csv(csv_buffer)
        # # Convert DataFrame to a string
        # text = df.to_string(index=False)
            


    else:
        raise HTTPException(status_code=500, detail="Unsupported file content type")

    return {"filename": file.filename, "text": text}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.post("/predict", response_model = Response)
# def predict() -> Any:pip
  
#   #implement this code block
  
#   return {"result": "hello world!"}

if __name__=="__main__":
    uvicorn.run(app,host="localhost",port=8000)