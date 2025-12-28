"""Tests for document extractors."""

import pytest
from app.extractors import (
    BaseExtractor,
    TextExtractor,
    PDFExtractor,
    DocxExtractor,
    VideoExtractor,
)


class TestTextExtractor:
    """Tests for plain text extraction."""

    def test_extract_utf8(self):
        extractor = TextExtractor()
        content = b"Hello, World!"
        result = extractor.extract(content, "test.txt")

        assert len(result) == 1
        assert result[0].text == "Hello, World!"

    def test_extract_utf8_with_unicode(self):
        extractor = TextExtractor()
        content = "Hello, 世界! 🌍".encode("utf-8")
        result = extractor.extract(content, "test.txt")

        assert len(result) == 1
        assert "世界" in result[0].text

    def test_extract_empty(self):
        extractor = TextExtractor()
        result = extractor.extract(b"", "empty.txt")

        assert len(result) == 0

    def test_extract_whitespace_only(self):
        extractor = TextExtractor()
        result = extractor.extract(b"   \n\t  ", "whitespace.txt")

        assert len(result) == 0


class TestExtractorFactory:
    """Tests for extractor factory."""

    def test_get_pdf_extractor(self):
        extractor = BaseExtractor.get_extractor("pdf")
        assert isinstance(extractor, PDFExtractor)

    def test_get_docx_extractor(self):
        extractor = BaseExtractor.get_extractor("docx")
        assert isinstance(extractor, DocxExtractor)

    def test_get_txt_extractor(self):
        extractor = BaseExtractor.get_extractor("txt")
        assert isinstance(extractor, TextExtractor)

    def test_get_notes_extractor(self):
        extractor = BaseExtractor.get_extractor("notes")
        assert isinstance(extractor, TextExtractor)

    def test_get_video_extractor(self):
        extractor = BaseExtractor.get_extractor("video")
        assert isinstance(extractor, VideoExtractor)

    def test_get_unknown_defaults_to_text(self):
        extractor = BaseExtractor.get_extractor("unknown_type")
        assert isinstance(extractor, TextExtractor)


class TestPDFExtractor:
    """Tests for PDF extraction (requires pdfplumber)."""

    @pytest.mark.skip(reason="Requires real PDF file")
    def test_extract_pdf(self):
        """Placeholder for PDF extraction test."""
        pass


class TestVideoExtractor:
    """Tests for video/audio extraction."""

    def test_extract_without_whisper(self):
        """Without whisper installed, should return placeholder."""
        extractor = VideoExtractor()
        content = b"fake video content"
        result = extractor.extract(content, "test.mp4")

        # Should return at least one result (placeholder or error)
        assert len(result) >= 1
