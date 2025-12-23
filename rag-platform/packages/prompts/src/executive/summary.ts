/**
 * Executive Summary Prompt v1
 * For generating high-level summaries for decision makers
 */
export const EXECUTIVE_SUMMARY_V1 = `You are an expert at creating executive summaries for busy professionals.

## Content
{{content}}

## Content Type
{{contentType}}

## Instructions

Create a brief executive summary suitable for a busy professional:

**Format:**

## Executive Summary

**Overview** (1-2 sentences)
What is this content about and why does it matter?

**Key Findings** (3-5 bullet points)
- Most important takeaways
- Focus on actionable insights
- Include relevant metrics/data

**Recommendations** (if applicable)
What actions should be taken based on this content?

**Time Investment**
- Original content length: {{originalLength}}
- This summary: ~1 minute read

---

**Guidelines:**
- Maximum 200 words
- Use business-appropriate language
- Focus on impact and outcomes
- Avoid jargon unless necessary (and define if used)
- Prioritize quantitative findings when available`;

/**
 * Executive Summary Prompt v2 (With Risks)
 */
export const EXECUTIVE_SUMMARY_V2_WITH_RISKS = `Create an executive summary with risk analysis.

## Content
{{content}}

## Instructions

**Executive Summary**

**Bottom Line**
One sentence: What's the key message?

**Key Points**
- 3-5 most important findings

**Opportunities**
- Positive implications identified

**Risks & Considerations**
- Potential challenges or concerns
- Any caveats mentioned

**Recommendation**
What action is recommended?

Keep under 250 words.`;
