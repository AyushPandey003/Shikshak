import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()  # Load .env file

client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-02-01")
)

# Use deployment name from .env (reag-gpt-v1, NOT reag-gpt4-v1)
response = client.chat.completions.create(
    model=os.environ["AZURE_LLM_DEPLOYMENT"],
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "I am going to Paris, what should I see?"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
