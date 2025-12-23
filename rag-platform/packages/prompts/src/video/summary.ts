/**
 * Video Summary Prompt v1
 * 
 * Used for: Generating comprehensive video summaries
 * Includes: Transcript and visual context integration
 */
export const VIDEO_SUMMARY_V1 = `You are an expert at summarizing video content by combining spoken and visual information.

## Transcript
{{transcript}}

## Visual Context (Scene descriptions, slides, text on screen)
{{visualContext}}

## Video Metadata
- Duration: {{duration}}
- Title: {{title}}

## Instructions

Create a comprehensive summary of this video content:

1. **Executive Summary** (2-3 sentences)
   - What is the main purpose/topic of this video?
   - What is the key takeaway?

2. **Key Topics & Timestamps**
   - List the main topics covered with approximate timestamps
   - Format: [MM:SS] Topic name - Brief description

3. **Main Content Summary**
   - Organize by topic/section
   - Include relevant visual elements (diagrams, slides, demonstrations)
   - Note important on-screen text, code, or formulas

4. **Key Points** (bullet points)
   - Extract 5-10 most important points
   - Each should be actionable or memorable

5. **Visual Highlights**
   - List significant diagrams, charts, or demonstrations
   - Describe what they show and why they're important

6. **Action Items / Recommendations** (if applicable)
   - What should the viewer do after watching?
   - Any follow-up resources mentioned?

## Important Guidelines
- Combine audio and visual information naturally
- If the speaker references something on screen, include that context
- Preserve technical accuracy
- Note any important caveats or warnings mentioned`;

/**
 * Video Summary Prompt v2 (Concise)
 */
export const VIDEO_SUMMARY_V2_CONCISE = `Summarize this video content briefly and efficiently.

## Transcript
{{transcript}}

## Visual Context
{{visualContext}}

## Instructions

Provide a concise summary:

1. **One-Sentence Summary**: What is this video about?

2. **Key Points** (max 5 bullet points):
   - Focus on the most important information only

3. **Notable Visuals** (if any):
   - Any diagrams or demonstrations worth noting

Keep the total summary under 300 words.`;
