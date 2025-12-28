"""Pytest configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create test client for FastAPI app."""
    return TestClient(app)


@pytest.fixture
def sample_text():
    """Sample text for testing."""
    return """
    Machine learning is a subset of artificial intelligence (AI) that provides 
    systems the ability to automatically learn and improve from experience without 
    being explicitly programmed. Machine learning focuses on the development of 
    computer programs that can access data and use it to learn for themselves.
    
    Deep learning is part of a broader family of machine learning methods based 
    on artificial neural networks with representation learning. Learning can be 
    supervised, semi-supervised or unsupervised.
    """


@pytest.fixture
def sample_metadata():
    """Sample metadata for testing."""
    return {
        "course_id": "TEST101",
        "module_id": "M01",
        "source_type": "notes",
        "source_uri": "blob://test/test.txt",
    }
