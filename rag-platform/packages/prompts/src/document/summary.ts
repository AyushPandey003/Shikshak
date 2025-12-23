/**
 * Document Summary Prompt v1
 */
export const DOCUMENT_SUMMARY_V1 = `You are an expert at analyzing and summarizing documents.

## Document Information
- Title: {{title}}
- Type: {{documentType}}
- Page Count: {{pageCount}}

## Content
{{content}}

## Instructions

Create a comprehensive document summary:

1. **Executive Summary** (2-3 sentences)
   - What is this document about?
   - What is its main purpose?

2. **Document Structure**
   - Outline the main sections
   - Note how the document is organized

3. **Key Arguments & Findings**
   - Main points made by the author(s)
   - Key data or evidence presented
   - Important conclusions

4. **Key Takeaways** (bullet points)
   - 5-10 most important points
   - What should the reader remember?

5. **Recommendations / Action Items** (if present)
   - What does the document recommend?
   - Any next steps suggested?

6. **Notable Elements**
   - Important tables, figures, or appendices
   - Any supplementary materials

## Guidelines
- Preserve the author's intent and tone
- Maintain technical accuracy
- Note any limitations or caveats mentioned`;

/**
 * Document Summary Prompt v2 (Academic)
 */
export const DOCUMENT_SUMMARY_V2_ACADEMIC = `Analyze this document with academic rigor.

## Document
{{content}}

## Instructions

Provide a scholarly analysis:

1. **Abstract** (100-150 words)
   - Summarize the document's purpose, methodology, and findings

2. **Thesis / Main Argument**
   - What is the central claim or hypothesis?

3. **Methodology** (if applicable)
   - How was the research conducted?
   - What data sources were used?

4. **Key Findings**
   - Main results or conclusions
   - Supporting evidence

5. **Critical Analysis**
   - Strengths of the document
   - Potential limitations or gaps

6. **Implications**
   - What are the broader implications?
   - How does this contribute to the field?

Use formal academic language throughout.`;
