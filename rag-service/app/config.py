import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Vector DB - Qdrant
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    COLLECTION_NAME: str = "course_rag"
    VECTOR_DIMENSION: int = 1536  # text-embedding-ada-002 or text-embedding-3-small

    # Azure OpenAI - Single resource for both LLM and Embeddings
    AZURE_OPENAI_API_KEY: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_API_VERSION: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-01")

    # Deployments (both on same resource)
    AZURE_LLM_DEPLOYMENT: str = os.getenv("AZURE_LLM_DEPLOYMENT", "gpt-4")
    AZURE_EMBEDDING_DEPLOYMENT: str = os.getenv(
        "AZURE_EMBEDDING_DEPLOYMENT", "text-embedding-ada-002"
    )

    # LLM Settings
    LLM_TEMPERATURE: float = 0.0  # Deterministic for no hallucination
    LLM_MAX_TOKENS: int = 1024

    # Chunking Configuration
    CHUNK_SIZE_TOKENS: int = 500
    CHUNK_OVERLAP_TOKENS: int = 50

    # Query Configuration
    DEFAULT_TOP_K: int = 5
    SCORE_THRESHOLD: float = 0.0  # Lowered to 0 for debugging; filter in app if needed

    # Redis (for background jobs)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Azure Blob Storage (optional)
    AZURE_STORAGE_CONNECTION_STRING: Optional[str] = os.getenv(
        "AZURE_STORAGE_CONNECTION_STRING"
    )
    AZURE_BLOB_CONTAINER: str = "rag-documents"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
