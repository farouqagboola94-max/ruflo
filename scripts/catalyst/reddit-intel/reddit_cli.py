#!/usr/bin/env python3
"""
CatalystOS Reddit Intelligence - CLI Runner
Command-line interface for executing the Reddit analysis pipeline
"""

import argparse
import sys
import logging
import json
from pathlib import Path
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import orchestrator
try:
    from catalyst_reddit_orchestrator import CatalystRedditOS
except ImportError:
    logger.error("Failed to import CatalystRedditOS. Ensure all modules are in the same directory.")
    sys.exit(1)


def validate_environment() -> bool:
    """Check if required environment variables are set"""
    required = ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'ANTHROPIC_API_KEY']
    missing = []
    
    for var in required:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        logger.error(f"Missing required environment variables: {', '.join(missing)}")
        logger.info("Set them in .env file or export them directly")
        return False
    
    return True


def print_banner():
    """Print CatalystOS banner"""
    banner = """
    ╔═══════════════════════════════════════════════════════════╗
    ║     CatalystOS Reddit Intelligence v1.0                   ║
    ║     Content Strategy from Real Audience Insights          ║
    ╚═══════════════════════════════════════════════════════════╝
    """
    print(banner)


def parse_arguments():
    """Parse command-line arguments"""
    parser = argparse.ArgumentParser(
        description='CatalystOS Reddit Intelligence - Content Strategy Pipeline',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                                          # Run with default subreddits
  %(prog)s --subreddits Nigeria Lagos Naija         # Specify subreddits
  %(prog)s --max-analyses 20 --output-sheet ABC123  # Custom config
  %(prog)s --help-setup                             # Show setup instructions
        """
    )
    
    parser.add_argument(
        '--subreddits',
        nargs='+',
        default=None,
        help='Subreddit names to analyze (space-separated, no r/ prefix)'
    )
    
    parser.add_argument(
        '--max-analyses',
        type=int,
        default=10,
        help='Maximum posts to analyze with Claude (default: 10)'
    )
    
    parser.add_argument(
        '--posts-per-sub',
        type=int,
        default=20,
        help='Number of top posts per subreddit (default: 20)'
    )
    
    parser.add_argument(
        '--output-sheet',
        type=str,
        default=None,
        help='Existing Google Sheet ID to append to (creates new sheet if not provided)'
    )
    
    parser.add_argument(
        '--save-json',
        action='store_true',
        default=True,
        help='Save raw posts to JSON file (default: True)'
    )
    
    parser.add_argument(
        '--no-save-json',
        action='store_false',
        dest='save_json',
        help='Skip JSON file save'
    )
    
    parser.add_argument(
        '--output-file',
        type=str,
        default=None,
        help='Path to save results JSON (auto-generated if not provided)'
    )
    
    parser.add_argument(
        '--validate-env',
        action='store_true',
        help='Check if all required environment variables are set'
    )
    
    parser.add_argument(
        '--help-setup',
        action='store_true',
        help='Show detailed setup instructions'
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version='CatalystOS Reddit Intelligence v1.0'
    )
    
    return parser.parse_args()


def show_setup_help():
    """Show setup instructions"""
    setup_text = """
SETUP INSTRUCTIONS FOR CATALYSTOS REDDIT INTELLIGENCE

1. INSTALL DEPENDENCIES
   $ pip install -r requirements.txt

2. GET REDDIT API CREDENTIALS
   - Go to https://reddit.com/prefs/apps
   - Create app → Copy Client ID and Secret
   - Add to .env:
     REDDIT_CLIENT_ID=your_id
     REDDIT_CLIENT_SECRET=your_secret

3. GET CLAUDE API KEY
   - Go to https://console.anthropic.com/
   - Copy API key and add to .env:
     ANTHROPIC_API_KEY=sk-ant-xxx

4. (OPTIONAL) SET UP GOOGLE SHEETS
   - Create service account at console.cloud.google.com
   - Download JSON key as google-credentials.json
   - Add to .env:
     GOOGLE_SHEETS_CREDENTIALS=./google-credentials.json

5. TEST INSTALLATION
   $ python reddit_cli.py --validate-env
   $ python reddit_cli.py --subreddits Nigeria Lagos

Then check .env file with your credentials and run!
    """
    print(setup_text)


def format_results(results: dict) -> str:
    """Format results for display"""
    output = "\n" + "=" * 60 + "\n"
    output += "PIPELINE RESULTS\n"
    output += "=" * 60 + "\n"
    
    output += f"Start: {results['start_time']}\n"
    output += f"End: {results['end_time']}\n\n"
    
    output += f"Posts Collected: {results['posts_collected']}\n"
    output += f"Posts Analyzed: {results['posts_analyzed']}\n"
    output += f"Subreddits: {', '.join(results['subreddits'])}\n\n"
    
    if results.get('raw_json_saved'):
        output += f"Raw Data: {results['raw_json_saved']}\n"
    
    if results['sheets_status'] == 'success':
        output += f"Google Sheet: {results.get('sheets_url', 'N/A')}\n"
    
    output += "\n--- STRATEGY SUMMARY ---\n"
    if results.get('summary'):
        summary = results['summary']
        output += f"Sentiment: {summary.get('dominant_sentiment', 'N/A')}\n"
        output += f"Recommended Tone: {summary.get('tone_recommendation', 'N/A')}\n"
        
        if summary.get('top_hooks'):
            output += f"\nTop Hooks:\n"
            for i, hook in enumerate(summary['top_hooks'][:3], 1):
                output += f"  {i}. {hook}\n"
        
        output += f"\nStrategy: {summary.get('content_strategy', 'N/A')}\n"
    
    if results.get('errors'):
        output += f"\n⚠ Errors:\n"
        for error in results['errors']:
            output += f"  - {error}\n"
    
    output += "=" * 60 + "\n"
    return output


def main():
    """Main CLI entry point"""
    args = parse_arguments()
    
    # Show banner
    print_banner()
    
    # Handle help commands
    if args.help_setup:
        show_setup_help()
        return 0
    
    if args.validate_env:
        logger.info("Validating environment variables...")
        if validate_environment():
            logger.info("✓ All required environment variables are set")
            return 0
        else:
            logger.error("✗ Missing environment variables")
            return 1
    
    # Validate environment
    if not validate_environment():
        logger.info("\nRun 'python reddit_cli.py --help-setup' for setup instructions")
        return 1
    
    logger.info("Environment validated ✓\n")
    
    # Initialize pipeline
    try:
        logger.info("Initializing CatalystOS Reddit Intelligence...")
        catalyst = CatalystRedditOS()
    except Exception as e:
        logger.error(f"Failed to initialize: {str(e)}")
        return 1
    
    # Determine subreddits
    subreddits = args.subreddits
    if not subreddits:
        from catalyst_reddit_module import RedditConfig
        subreddits = RedditConfig.DEFAULT_SUBREDDITS
        logger.info(f"Using default subreddits: {', '.join(subreddits)}")
    else:
        logger.info(f"Using specified subreddits: {', '.join(subreddits)}")
    
    # Run pipeline
    logger.info("\nStarting pipeline...\n")
    try:
        results = catalyst.run_full_pipeline(
            subreddits=subreddits,
            output_spreadsheet_id=args.output_sheet,
            posts_per_sub=args.posts_per_sub,
            max_analyses=args.max_analyses,
            save_raw_json=args.save_json
        )
        
        # Display results
        print(format_results(results))
        
        # Save results to file
        output_file = args.output_file
        if output_file is None:
            from datetime import datetime
            output_file = f"catalyst_reddit_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        catalyst.save_results_locally(results, output_file)
        logger.info(f"Full results saved to: {output_file}\n")
        
        return 0
        
    except KeyboardInterrupt:
        logger.info("\n\nPipeline interrupted by user")
        return 130
    except Exception as e:
        logger.error(f"Pipeline failed: {str(e)}")
        logger.debug(str(e), exc_info=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
