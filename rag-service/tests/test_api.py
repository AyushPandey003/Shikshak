"""Tests for API endpoints."""


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_returns_200(self, client):
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_response_format(self, client):
        response = client.get("/health")
        data = response.json()

        assert "status" in data
        assert "version" in data
        assert "qdrant_connected" in data


class TestRootEndpoint:
    """Tests for root endpoint (UI)."""

    def test_root_returns_html(self, client):
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")


class TestQueryEndpoint:
    """Tests for query endpoint."""

    def test_query_requires_body(self, client):
        response = client.post("/query")
        assert response.status_code == 422  # Validation error

    def test_query_accepts_valid_request(self, client):
        response = client.post("/query", json={"query": "test question"})
        # Should work (might return no results, but shouldn't error)
        assert response.status_code == 200

    def test_query_with_filters(self, client):
        response = client.post(
            "/query",
            json={
                "query": "test question",
                "course_id": "TEST101",
                "module_id": "M01",
                "top_k": 3,
            },
        )
        assert response.status_code == 200

    def test_query_response_format(self, client):
        response = client.post("/query", json={"query": "test question"})
        data = response.json()

        assert "answer" in data
        assert "sources" in data
        assert "debug" in data
        assert isinstance(data["sources"], list)


class TestIngestEndpoint:
    """Tests for ingest endpoint."""

    def test_ingest_requires_file(self, client):
        response = client.post(
            "/ingest",
            data={"course_id": "TEST101", "module_id": "M01", "source_type": "txt"},
        )
        assert response.status_code == 422  # Missing file

    def test_ingest_requires_metadata(self, client):
        # Create a simple text file
        files = {"file": ("test.txt", b"test content", "text/plain")}
        response = client.post("/ingest", files=files)
        assert response.status_code == 422  # Missing metadata

    def test_ingest_validates_source_type(self, client):
        files = {"file": ("test.txt", b"test content", "text/plain")}
        response = client.post(
            "/ingest",
            files=files,
            data={
                "course_id": "TEST101",
                "module_id": "M01",
                "source_type": "invalid_type",
            },
        )
        assert response.status_code == 400


class TestLegacyEndpoints:
    """Tests for legacy endpoints."""

    def test_simple_query_exists(self, client):
        response = client.post("/query/simple", params={"question": "test"})
        # Should not 404
        assert response.status_code != 404
