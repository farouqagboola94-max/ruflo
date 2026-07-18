"""
CatalystOS Reddit Intelligence Module
Extract actionable content strategy from Reddit community psychology
"""

__version__ = "1.0.0"
__author__ = "Catalyst (Oluwatobiloba)"
__description__ = "Reddit scraping + Claude AI analysis + Google Sheets storage"

# Import main components
try:
    from .catalyst_reddit_module import RedditIntelligenceCollector, RedditConfig
    from .catalyst_claude_analysis import ClaudeAnalysisEngine
    from .catalyst_sheets_handler import CatalystSheetsHandler
    from .catalyst_reddit_orchestrator import CatalystRedditOS, quickstart
except ImportError:
    # Allow module to be used in CLI without full dependencies
    pass

__all__ = [
    'RedditIntelligenceCollector',
    'ClaudeAnalysisEngine',
    'CatalystSheetsHandler',
    'CatalystRedditOS',
    'quickstart',
    'RedditConfig'
]
