"""
CatalystOS Reddit Intelligence Orchestrator
Main execution engine coordinating Reddit collection, AI analysis, and Sheets storage
"""

import json
import logging
from typing import List, Dict, Optional
from datetime import datetime
import sys
import os

# Import modules (assumes they're in same directory)
from catalyst_reddit_module import RedditIntelligenceCollector, RedditConfig
from catalyst_claude_analysis import ClaudeAnalysisEngine, PostAnalysis
from catalyst_sheets_handler import CatalystSheetsHandler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CatalystRedditOS:
    """Main orchestration engine for Reddit intelligence pipeline"""
    
    def __init__(self, 
                 reddit_client_id: str = None,
                 reddit_secret: str = None,
                 claude_api_key: str = None,
                 sheets_credentials: str = None):
        """Initialize all components"""
        
        logger.info("Initializing CatalystOS Reddit Intelligence System...")
        
        self.reddit_collector = RedditIntelligenceCollector(
            client_id=reddit_client_id,
            client_secret=reddit_secret
        )
        
        self.claude_engine = ClaudeAnalysisEngine(api_key=claude_api_key)
        self.sheets_handler = CatalystSheetsHandler(credentials_path=sheets_credentials)
        
        self.config = RedditConfig.get_config()
        logger.info("CatalystOS Ready")
    
    def run_full_pipeline(self,
                         subreddits: Optional[List[str]] = None,
                         output_spreadsheet_id: Optional[str] = None,
                         posts_per_sub: int = 20,
                         max_analyses: int = 10,
                         save_raw_json: bool = True) -> Dict:
        """
        Execute complete pipeline: Collect → Analyze → Store
        
        Args:
            subreddits: List of subreddit names (default: RedditConfig defaults)
            output_spreadsheet_id: Existing sheet ID to append to (creates new if None)
            posts_per_sub: Number of top posts per subreddit
            max_analyses: Maximum posts to analyze with Claude
            save_raw_json: Save raw posts to JSON file
        
        Returns:
            Pipeline results summary
        """
        
        logger.info("=" * 60)
        logger.info("CATALYST REDDIT INTELLIGENCE PIPELINE STARTED")
        logger.info("=" * 60)
        
        results = {
            "start_time": datetime.utcnow().isoformat(),
            "subreddits": subreddits or self.config['subreddits'],
            "posts_collected": 0,
            "posts_analyzed": 0,
            "sheets_status": "not_configured",
            "raw_json_saved": False,
            "analyses": [],
            "summary": None,
            "errors": []
        }
        
        # STEP 1: Collect posts from Reddit
        logger.info("\n[STEP 1] COLLECTING POSTS FROM REDDIT")
        try:
            posts = self.reddit_collector.fetch_posts(
                subreddits=results['subreddits'],
                limit=posts_per_sub
            )
            
            # Filter by engagement
            posts = self.reddit_collector.filter_posts_by_engagement(posts)
            posts = self.reddit_collector.deduplicate_posts(posts)
            
            results['posts_collected'] = len(posts)
            logger.info(f"✓ Collected {len(posts)} high-engagement posts")
            
            # Save raw posts
            if save_raw_json:
                json_path = f"reddit_posts_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                self.reddit_collector.save_raw_posts(posts, json_path)
                results['raw_json_saved'] = json_path
                
        except Exception as e:
            logger.error(f"Error in collection step: {str(e)}")
            results['errors'].append(f"Collection failed: {str(e)}")
            return results
        
        # STEP 2: Analyze posts with Claude
        logger.info("\n[STEP 2] ANALYZING WITH CLAUDE AI")
        try:
            # Convert to dict format for analysis
            posts_dict = [
                {
                    'post_id': p.post_id,
                    'subreddit': p.subreddit,
                    'title': p.title,
                    'selftext': p.selftext,
                    'score': p.score,
                    'num_comments': p.num_comments
                } for p in posts
            ]
            
            analyses = self.claude_engine.batch_analyze_posts(posts_dict, max_posts=max_analyses)
            results['posts_analyzed'] = len(analyses)
            logger.info(f"✓ Analyzed {len(analyses)} posts")
            
            # Convert PostAnalysis objects to dicts for storage
            for analysis in analyses:
                results['analyses'].append({
                    'post_id': analysis.post_id,
                    'subreddit': analysis.subreddit,
                    'original_title': analysis.original_title,
                    'sentiment_label': analysis.sentiment_label,
                    'sentiment_score': analysis.sentiment_score,
                    'core_insight': analysis.core_insight,
                    'audience_psychology': analysis.audience_psychology,
                    'content_hook': analysis.content_hook,
                    'alternative_angles': analysis.alternative_angles,
                    'tone_match': analysis.tone_match,
                    'engagement_potential': analysis.engagement_potential,
                    'catalyst_perspective': analysis.catalyst_perspective
                })
            
            # Generate strategy summary
            summary = self.claude_engine.generate_strategy_summary(analyses)
            results['summary'] = summary
            logger.info("✓ Strategy summary generated")
            
        except Exception as e:
            logger.error(f"Error in analysis step: {str(e)}")
            results['errors'].append(f"Analysis failed: {str(e)}")
            # Continue to storage even if analysis fails
        
        # STEP 3: Store to Google Sheets
        logger.info("\n[STEP 3] STORING TO GOOGLE SHEETS")
        if self.sheets_handler.client:
            try:
                # Create new sheet if ID not provided
                if not output_spreadsheet_id:
                    output_spreadsheet_id = self.sheets_handler.create_analysis_sheet()
                    if not output_spreadsheet_id:
                        raise Exception("Failed to create spreadsheet")
                
                # Append analyses
                if results['analyses']:
                    self.sheets_handler.append_analyses_to_sheet(
                        output_spreadsheet_id,
                        results['analyses']
                    )
                
                # Add summary sheet
                if results['summary']:
                    self.sheets_handler.create_summary_sheet(
                        output_spreadsheet_id,
                        results['summary']
                    )
                
                sheets_url = self.sheets_handler.get_spreadsheet_url(output_spreadsheet_id)
                results['sheets_status'] = 'success'
                results['sheets_url'] = sheets_url
                logger.info(f"✓ Data stored to: {sheets_url}")
                
            except Exception as e:
                logger.error(f"Error in sheets storage: {str(e)}")
                results['sheets_status'] = 'failed'
                results['errors'].append(f"Sheets storage failed: {str(e)}")
        else:
            logger.warning("⚠ Google Sheets not configured (skipping storage)")
            results['sheets_status'] = 'not_configured'
        
        # Summary
        logger.info("\n" + "=" * 60)
        logger.info("PIPELINE COMPLETE")
        logger.info(f"Posts Collected: {results['posts_collected']}")
        logger.info(f"Posts Analyzed: {results['posts_analyzed']}")
        logger.info(f"Sheets Storage: {results['sheets_status']}")
        if results['sheets_status'] == 'success':
            logger.info(f"View results: {results['sheets_url']}")
        logger.info("=" * 60)
        
        results['end_time'] = datetime.utcnow().isoformat()
        return results
    
    def save_results_locally(self, results: Dict, output_path: str = None) -> str:
        """Save pipeline results to JSON file"""
        if output_path is None:
            output_path = f"catalyst_reddit_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        logger.info(f"Results saved to: {output_path}")
        return output_path


# Quick start function for CLI usage
def quickstart(subreddits: Optional[List[str]] = None, spreadsheet_id: Optional[str] = None):
    """Quick start for running the full pipeline"""
    
    logger.info("CatalystOS Reddit Intelligence - Quick Start")
    logger.info("Checking environment variables...")
    
    required_env = ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'ANTHROPIC_API_KEY']
    missing = [var for var in required_env if not os.getenv(var)]
    
    if missing:
        logger.error(f"Missing environment variables: {', '.join(missing)}")
        logger.info("Set them with: export VAR_NAME=value")
        return None
    
    try:
        catalyst_os = CatalystRedditOS()
        results = catalyst_os.run_full_pipeline(
            subreddits=subreddits,
            output_spreadsheet_id=spreadsheet_id
        )
        
        # Save results locally
        catalyst_os.save_results_locally(results)
        return results
        
    except Exception as e:
        logger.error(f"Pipeline failed: {str(e)}")
        return None


if __name__ == "__main__":
    # Example usage
    DEFAULT_SUBS = ["Nigeria", "Lagos", "Naija", "NaijaSnark"]
    quickstart(subreddits=DEFAULT_SUBS)
