import requests
import json

# Full context mode - gets entire transcript, no source chunks in response
response = requests.post(
    "http://localhost:8000/query",
    json={
        "query": " what are the percentage of sinhalese and indian tamils in sri lanka?",
        "course_id": "15",
        "module_id": "7",
        "full_context": False,      # Get entire transcript
        "include_sources": True,  # Don't return 496 chunks in response
        "top_k":10
    }
)
print(json.dumps(response.json(), indent=2))