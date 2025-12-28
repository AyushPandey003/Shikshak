"""Tests for chunking module."""

from app.chunking import chunk_text, count_tokens, chunk_extracted_content
from app.extractors import ExtractedContent


class TestCountTokens:
    """Tests for token counting with tiktoken."""

    def test_empty_string(self):
        assert count_tokens("") == 0

    def test_short_text(self):
        text = "Hello world"
        tokens = count_tokens(text)
        # tiktoken will give exact count (2 tokens for "Hello world")
        assert tokens == 2

    def test_longer_text(self):
        text = "This is a longer piece of text for testing."
        tokens = count_tokens(text)
        # Actual token count should be reasonable
        assert tokens > 0 and tokens < 20


class TestChunkText:
    """Tests for text chunking."""

    def test_empty_text(self, sample_metadata):
        chunks = chunk_text("", source_metadata=sample_metadata)
        assert len(chunks) == 0

    def test_single_chunk(self, sample_metadata):
        """Short text should produce single chunk."""
        short_text = "This is a very short text."
        chunks = chunk_text(
            short_text, chunk_size_tokens=100, source_metadata=sample_metadata
        )
        assert len(chunks) == 1
        assert chunks[0].text == short_text

    def test_multiple_chunks(self, sample_metadata):
        """Long text should produce multiple chunks."""
        # Create text longer than chunk size
        long_text = "This is a test sentence. " * 100  # ~2500 chars
        chunks = chunk_text(
            long_text,
            chunk_size_tokens=100,  # ~400 chars per chunk
            overlap_tokens=10,
            source_metadata=sample_metadata,
        )
        assert len(chunks) > 1

    def test_metadata_preserved(self, sample_metadata):
        """Chunk metadata should match source metadata."""
        text = "Test content for metadata verification."
        chunks = chunk_text(text, source_metadata=sample_metadata)

        assert len(chunks) == 1
        assert chunks[0].metadata.course_id == sample_metadata["course_id"]
        assert chunks[0].metadata.module_id == sample_metadata["module_id"]
        assert chunks[0].metadata.source_type == sample_metadata["source_type"]

    def test_content_hash_unique(self, sample_metadata):
        """Different chunks should have different content hashes."""
        long_text = "First unique sentence. " * 50 + "Second unique content. " * 50
        chunks = chunk_text(
            long_text,
            chunk_size_tokens=100,
            overlap_tokens=0,
            source_metadata=sample_metadata,
        )

        if len(chunks) > 1:
            hashes = [c.metadata.content_hash for c in chunks]
            # Most hashes should be unique (overlap might create duplicates)
            unique_hashes = set(hashes)
            assert len(unique_hashes) >= len(hashes) * 0.8

    def test_chunk_indexing(self, sample_metadata):
        """Chunks should be sequentially indexed."""
        long_text = "Test sentence number one. " * 100
        chunks = chunk_text(
            long_text,
            chunk_size_tokens=50,
            overlap_tokens=10,
            source_metadata=sample_metadata,
        )

        for i, chunk in enumerate(chunks):
            assert chunk.metadata.chunk_index == i


class TestChunkExtractedContent:
    """Tests for chunking extracted content."""

    def test_single_content(self, sample_metadata):
        """Single extracted content should chunk correctly."""
        content = ExtractedContent(text="This is extracted text. " * 50, page_number=1)

        chunks = chunk_extracted_content(
            [content],
            chunk_size_tokens=50,
            overlap_tokens=10,
            base_metadata=sample_metadata,
        )

        assert len(chunks) > 0
        # Page number should be preserved
        assert all(c.metadata.page_number == 1 for c in chunks)

    def test_multiple_contents(self, sample_metadata):
        """Multiple extracted contents should all be chunked."""
        contents = [
            ExtractedContent(text="Page one content. " * 30, page_number=1),
            ExtractedContent(text="Page two content. " * 30, page_number=2),
        ]

        chunks = chunk_extracted_content(
            contents,
            chunk_size_tokens=50,
            overlap_tokens=10,
            base_metadata=sample_metadata,
        )

        assert len(chunks) >= 2
        # Should have chunks from both pages
        page_numbers = {c.metadata.page_number for c in chunks}
        assert 1 in page_numbers
        assert 2 in page_numbers

    def test_video_timestamps(self, sample_metadata):
        """Video content should preserve timestamps."""
        content = ExtractedContent(
            text="Video transcript segment.",
            start_time_seconds=60,
            end_time_seconds=120,
        )

        chunks = chunk_extracted_content([content], base_metadata=sample_metadata)

        assert len(chunks) == 1
        assert chunks[0].metadata.start_time_seconds == 60
        assert chunks[0].metadata.end_time_seconds == 120
