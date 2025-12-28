import requests
import json

# Query the ingested notes
response = requests.post(
    "http://localhost:8000/query",
    json={
        "query": "Generate some questions on srilanka?",
        "course_id": "15",
        "full_context": False,
        "include_sources": True,
        "top_k": 10
    }
)
print(json.dumps(response.json(), indent=2))
