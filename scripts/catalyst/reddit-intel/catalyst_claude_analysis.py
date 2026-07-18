"""
CatalystOS Claude Analysis Engine
Analyzes Reddit posts with perspective shifts, sentiment, and content strategy insights
"""

import anthropic
import json
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class PostAnalysis:
    post_id: str
    subreddit: str
    original_title: str
    sentiment_score: float  # -1 to 1
    sentiment_label: str  # "positive", "negative", "neutral"
    core_insight: str
    audience_psychology: str
    content_hook: str
    alternative_angles: List[str]
    tone_match: str
    engagement_potential: str
    catalyst_perspective: str  # The "void" analysis


class ClaudeAnalysisEngine:
    """AI-powered post analysis using Claude"""
    
    def __init__(self, api_key: str = None):
        """Initialize Claude API connection"""
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("Missing ANTHROPIC_API_KEY")
        
        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.model = "claude-3-5-sonnet-20241022"
        logger.info("Claude analysis engine initialized")
    
    def analyze_post(self, post_data: Dict) -> PostAnalysis:
        """
        Comprehensive analysis of a single Reddit post
        Uses Claude to extract psychology, sentiment, and content strategy insights
        """
        
        analysis_prompt = f"""You are a content strategy analyst and psychology expert operating from a position of strategic detachment (2024 "void year" perspective - brutal honesty, no fluff).

REDDIT POST DATA:
Title: {post_data['title']}
Subreddit: r/{post_data['subreddit']}
Content: {post_data['selftext']}
Engagement: {post_data['num_comments']} comments, {post_data['score']} upvotes

ANALYZE AND RESPOND ONLY WITH VALID JSON (no markdown, no extra text):
{{
    "sentiment_score": <float between -1 and 1>,
    "sentiment_label": "<positive|negative|neutral>",
    "core_insight": "<1-2 sentence distillation of what this post reveals about the audience>",
    "audience_psychology": "<What psychological need or frustration does this post tap into?>",
    "content_hook": "<Extract the single most powerful hook from this post>",
    "alternative_angles": ["<angle 1>", "<angle 2>", "<angle 3>"],
    "tone_match": "<What tone resonates here? (casual/authoritative/irreverent/educational)>",
    "engagement_potential": "<Why did this post perform? What makes it sticky?>",
    "catalyst_perspective": "<Brutal analysis: What's REALLY happening here? Cut through the surface.>"
}}

Be direct. No corporate language. Contractions required. Extract actionable insights."""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": analysis_prompt}
                ]
            )
            
            # Extract JSON from response
            response_text = response.content[0].text.strip()
            
            # Handle markdown code blocks
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()
            
            analysis_data = json.loads(response_text)
            
            analysis = PostAnalysis(
                post_id=post_data['post_id'],
                subreddit=post_data['subreddit'],
                original_title=post_data['title'],
                sentiment_score=analysis_data.get('sentiment_score', 0),
                sentiment_label=analysis_data.get('sentiment_label', 'neutral'),
                core_insight=analysis_data.get('core_insight', ''),
                audience_psychology=analysis_data.get('audience_psychology', ''),
                content_hook=analysis_data.get('content_hook', ''),
                alternative_angles=analysis_data.get('alternative_angles', []),
                tone_match=analysis_data.get('tone_match', ''),
                engagement_potential=analysis_data.get('engagement_potential', ''),
                catalyst_perspective=analysis_data.get('catalyst_perspective', '')
            )
            
            logger.info(f"Analyzed post {post_data['post_id']} - {analysis.sentiment_label}")
            return analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error for post {post_data['post_id']}: {str(e)}")
            # Return minimal analysis on parse failure
            return PostAnalysis(
                post_id=post_data['post_id'],
                subreddit=post_data['subreddit'],
                original_title=post_data['title'],
                sentiment_score=0,
                sentiment_label='neutral',
                core_insight='Analysis failed',
                audience_psychology='',
                content_hook=post_data['title'],
                alternative_angles=[],
                tone_match='',
                engagement_potential='',
                catalyst_perspective=''
            )
        except Exception as e:
            logger.error(f"Error analyzing post {post_data['post_id']}: {str(e)}")
            raise
    
    def batch_analyze_posts(self, posts: List[Dict], max_posts: int = 10) -> List[PostAnalysis]:
        """Analyze multiple posts (respecting rate limits)"""
        analyses = []
        
        for i, post in enumerate(posts[:max_posts]):
            logger.info(f"Analyzing post {i+1}/{min(len(posts), max_posts)}")
            try:
                analysis = self.analyze_post(post)
                analyses.append(analysis)
            except Exception as e:
                logger.error(f"Skipping post due to error: {str(e)}")
                continue
        
        logger.info(f"Batch analysis complete: {len(analyses)} posts analyzed")
        return analyses
    
    def generate_strategy_summary(self, analyses: List[PostAnalysis]) -> Dict:
        """Generate high-level strategic insights from multiple analyses"""
        
        if not analyses:
            return {"error": "No analyses provided"}
        
        summary_prompt = f"""You are a strategic advisor analyzing Reddit post engagement patterns.
Given these analysis summaries, provide actionable content strategy insights.

ANALYSES:
{json.dumps([
    {{
        'post': a.original_title,
        'subreddit': a.subreddit,
        'sentiment': a.sentiment_label,
        'hook': a.content_hook,
        'tone': a.tone_match,
        'insight': a.core_insight
    }} for a in analyses[:5]
], indent=2)}

RESPOND WITH VALID JSON ONLY:
{{
    "dominant_sentiment": "<overall tone>",
    "top_hooks": ["<hook1>", "<hook2>", "<hook3>"],
    "tone_recommendation": "<what tone wins in this audience>",
    "psychology_synthesis": "<what do these posts reveal about the community?>",
    "content_strategy": "<actionable strategy for Catalyst>",
    "red_flags": ["<thing to avoid>", "<thing to avoid>"]
}}"""

        response = self.client.messages.create(
            model=self.model,
            max_tokens=800,
            messages=[{"role": "user", "content": summary_prompt}]
        )
        
        response_text = response.content[0].text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
            response_text = response_text.strip()
        
        summary = json.loads(response_text)
        logger.info("Strategy summary generated")
        return summary
