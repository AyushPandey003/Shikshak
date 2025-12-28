"""
Test script for video ingestion.
Supports MP4 and other video files with audio transcription.
"""

import requests
import json
import os

# Configuration
BASE_URL = "http://localhost:8000"
TEST_VIDEO_PATH = r"C:\Users\ayush\Desktop\rag-service\Civics.mp4"


def ingest_video(
    file_path: str,
    course_id: str = "TEST_COURSE",
    module_id: str = "VIDEO_MODULE",
    video_id: str = "VIDEO001"
) -> dict:
    """
    Ingest a video file into the RAG system (extracts audio and transcribes).
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        data = {
            "course_id": course_id,
            "module_id": module_id,
            "source_type": "video",
            "video_id": video_id,
        }
        
        print(f"Ingesting {os.path.basename(file_path)}...")
        print(f"  Course ID: {course_id}")
        print(f"  Module ID: {module_id}")
        print(f"  Video ID: {video_id}")
        print("  (This may take a while for audio transcription...)")
        
        response = requests.post(f"{BASE_URL}/ingest", files=files, data=data)
    
    result = response.json()
    print(json.dumps(result, indent=2))
    return result


if __name__ == "__main__":
    ingest_video(
        file_path=TEST_VIDEO_PATH,
        course_id="15",
        module_id="7",
        video_id="6"
    )
