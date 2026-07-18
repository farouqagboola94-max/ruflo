"""
CatalystOS Reddit Intelligence Module
Fetches, analyzes, and contextualizes Reddit posts for content strategy
"""

import praw
import json
import logging
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
from dotenv import load_dotenv
import os

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class RedditPost:
    post_id: str
    subreddit: str
    title: str
    selftext: str
    score: int
    num_comments: int
    created_utc: float
    url: str
    author: str
    fetch_timestamp: str


class RedditIntelligenceCollector:
    """Core Reddit scraping and collection engine"""
    
    def __init__(self, client_id: str = None, client_secret: str = None, user_agent: str = None):
        """Initialize Reddit API connection"""
        self.client_id = client_id or os.getenv("REDDIT_CLIENT_ID")
        self.client_secret = client_secret or os.getenv("REDDIT_CLIENT_SECRET")
        self.user_agent = user_agent or os.getenv("REDDIT_USER_AGENT", "CatalystOS/1.0")
        
        if not all([self.client_id, self.client_secret]):
            raise ValueError("Missing Reddit API credentials. Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET")
        
        self.reddit = praw.Reddit(
            client_id=self.client_id,
            client_secret=self.client_secret,
            user_agent=self.user_agent
        )
        logger.info("Reddit API connection initialized")
    
    def fetch_posts(
        self, 
        subreddits: List[str],
        limit: int = 10,
        time_filter: str = "week"
    ) -> List[RedditPost]:
        """
        Fetch top posts from multiple subreddits
        Args:
            subreddits: List of subreddit names (without r/)
            limit: Posts per subreddit
            time_filter: "hour", "day", "week", "month", "year", "all"
        """
        posts = []
        
        for subreddit_name in subreddits:
            try:
                logger.info(f"Fetching from r/{subreddit_name}")
                subreddit = self.reddit.subreddit(subreddit_name)
                
                for submission in subreddit.top(time_filter=time_filter, limit=limit):
                    post = RedditPost(
                        post_id=submission.id,
                        subreddit=subreddit_name,
                        title=submission.title,
                        selftext=submission.selftext[:500],  # Truncate for efficiency
                        score=submission.score,
                        num_comments=submission.num_comments,
                        created_utc=submission.created_utc,
                        url=submission.url,
                        author=str(submission.author),
                        fetch_timestamp=datetime.utcnow().isoformat()
                    )
                    posts.append(post)
                    
            except Exception as e:
                logger.error(f"Error fetching r/{subreddit_name}: {str(e)}")
                continue
        
        logger.info(f"Collected {len(posts)} posts from {len(subreddits)} subreddits")
        return posts
    
    def save_raw_posts(self, posts: List[RedditPost], output_path: str = "reddit_posts.json"):
        """Save raw posts to JSON"""
        data = {
            "fetch_time": datetime.utcnow().isoformat(),
            "total_posts": len(posts),
            "posts": [asdict(post) for post in posts]
        }
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Saved {len(posts)} posts to {output_path}")
        return output_path
    
    def filter_posts_by_engagement(self, posts: List[RedditPost], min_score: int = 100, min_comments: int = 10) -> List[RedditPost]:
        """Filter posts by engagement metrics"""
        filtered = [p for p in posts if p.score >= min_score and p.num_comments >= min_comments]
        logger.info(f"Filtered to {len(filtered)} high-engagement posts")
        return filtered
    
    def deduplicate_posts(self, posts: List[RedditPost]) -> List[RedditPost]:
        """Remove duplicate posts"""
        seen = set()
        unique = []
        for post in posts:
            if post.post_id not in seen:
                seen.add(post.post_id)
                unique.append(post)
        logger.info(f"Deduplicated: {len(posts)} → {len(unique)} posts")
        return unique


class RedditConfig:
    """Configuration management for Reddit module"""
    
    DEFAULT_SUBREDDITS = [
        "Nigeria",
        "Lagos",
        "Naija",
        "NigerianGamers",
        "NaijaSnark",
        "FashionNigeria"
    ]
    
    @staticmethod
    def get_config(custom_subreddits: Optional[List[str]] = None) -> Dict:
        """Get module configuration"""
        return {
            "subreddits": custom_subreddits or RedditConfig.DEFAULT_SUBREDDITS,
            "posts_per_sub": 20,
            "time_filter": "week",
            "min_engagement_score": 100,
            "min_engagement_comments": 10,
            "api_timeout": 30
        }
