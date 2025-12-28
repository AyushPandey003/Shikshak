"""
Test script for notes ingestion.
Supports PDF, TXT, and DOCX files.
"""

import requests
import json
import os

# Configuration
BASE_URL = "http://localhost:8000"
TEST_PDF_PATH = r"C:\Users\ayush\Desktop\rag-service\testDocs\madam.pdf"


def ingest_notes(
    file_path: str,
    course_id: str = "TEST_COURSE",
    module_id: str = "NOTES_MODULE",
    notes_id: str = "NOTE001"
) -> dict:
    """
    Ingest a notes file (PDF, TXT, or DOCX) into the RAG system.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    
    ext_to_source_type = {".pdf": "pdf", ".txt": "txt", ".docx": "docx"}
    source_type = ext_to_source_type.get(ext)
    if not source_type:
        raise ValueError(f"Unsupported file type: {ext}")
    
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        data = {
            "course_id": course_id,
            "module_id": module_id,
            "source_type": source_type,
            "notes_id": notes_id,
        }
        
        print(f"Ingesting {os.path.basename(file_path)}...")
        print(f"  Course ID: {course_id}")
        print(f"  Module ID: {module_id}")
        print(f"  Source Type: {source_type}")
        
        response = requests.post(f"{BASE_URL}/ingest", files=files, data=data)
    
    result = response.json()
    print(json.dumps(result, indent=2))
    return result


if __name__ == "__main__":
    ingest_notes(
        file_path=TEST_PDF_PATH,
        course_id="15",
        module_id="9",
        notes_id="4"
    )
