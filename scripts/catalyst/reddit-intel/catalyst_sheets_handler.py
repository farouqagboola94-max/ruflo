"""
CatalystOS Google Sheets Integration
Stores Reddit analysis results in Google Sheets for team access and ongoing reference
"""

import os
import json
import logging
from typing import List, Dict, Optional
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from google.oauth2 import service_account
import gspread
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CatalystSheetsHandler:
    """Google Sheets handler for Reddit analysis storage"""
    
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    
    def __init__(self, credentials_path: str = None):
        """
        Initialize Google Sheets connection
        Args:
            credentials_path: Path to service account JSON (default: ./google-credentials.json)
        """
        self.credentials_path = credentials_path or os.getenv('GOOGLE_SHEETS_CREDENTIALS', './google-credentials.json')
        
        if not os.path.exists(self.credentials_path):
            logger.warning(f"Google Sheets credentials not found at {self.credentials_path}")
            logger.info("To set up: Download service account JSON from Google Cloud Console")
            self.client = None
        else:
            try:
                self.credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_path,
                    scopes=self.SCOPES
                )
                self.client = gspread.authorize(self.credentials)
                logger.info("Google Sheets connection established")
            except Exception as e:
                logger.error(f"Failed to initialize Google Sheets: {str(e)}")
                self.client = None
    
    def create_analysis_sheet(self, spreadsheet_name: str = "CatalystOS Reddit Intelligence", 
                             email_for_sharing: Optional[str] = None) -> Optional[str]:
        """Create a new Google Sheet for Reddit analysis"""
        if not self.client:
            logger.error("Google Sheets client not initialized")
            return None
        
        try:
            spreadsheet = self.client.create(spreadsheet_name)
            spreadsheet_id = spreadsheet.id
            
            # Initialize with headers
            worksheet = spreadsheet.sheet1
            headers = [
                "Timestamp",
                "Post ID",
                "Subreddit",
                "Original Title",
                "Sentiment",
                "Sentiment Score",
                "Core Insight",
                "Audience Psychology",
                "Content Hook",
                "Tone Match",
                "Engagement Potential",
                "Alternative Angles",
                "Catalyst Perspective"
            ]
            worksheet.append_row(headers)
            
            # Share with email if provided
            if email_for_sharing:
                spreadsheet.share(email_for_sharing, perm_type='user', perm_role='writer')
                logger.info(f"Spreadsheet shared with {email_for_sharing}")
            
            logger.info(f"Created spreadsheet: {spreadsheet_name} (ID: {spreadsheet_id})")
            return spreadsheet_id
            
        except Exception as e:
            logger.error(f"Error creating spreadsheet: {str(e)}")
            return None
    
    def append_analyses_to_sheet(self, spreadsheet_id: str, analyses: List[Dict], 
                                 sheet_name: str = "Sheet1"):
        """Append analyzed posts to Google Sheet"""
        if not self.client:
            logger.error("Google Sheets client not initialized")
            return False
        
        try:
            spreadsheet = self.client.open_by_key(spreadsheet_id)
            worksheet = spreadsheet.worksheet(sheet_name)
            
            rows_to_append = []
            for analysis in analyses:
                row = [
                    datetime.utcnow().isoformat(),
                    analysis.get('post_id', ''),
                    analysis.get('subreddit', ''),
                    analysis.get('original_title', '')[:100],  # Truncate for sheet
                    analysis.get('sentiment_label', ''),
                    analysis.get('sentiment_score', ''),
                    analysis.get('core_insight', '')[:150],
                    analysis.get('audience_psychology', '')[:150],
                    analysis.get('content_hook', '')[:150],
                    analysis.get('tone_match', ''),
                    analysis.get('engagement_potential', '')[:100],
                    ' | '.join(analysis.get('alternative_angles', [])[:2]),
                    analysis.get('catalyst_perspective', '')[:200]
                ]
                rows_to_append.append(row)
            
            worksheet.append_rows(rows_to_append)
            logger.info(f"Appended {len(rows_to_append)} rows to spreadsheet")
            return True
            
        except Exception as e:
            logger.error(f"Error appending to spreadsheet: {str(e)}")
            return False
    
    def create_summary_sheet(self, spreadsheet_id: str, summary: Dict):
        """Create a summary sheet with strategic insights"""
        if not self.client:
            logger.error("Google Sheets client not initialized")
            return False
        
        try:
            spreadsheet = self.client.open_by_key(spreadsheet_id)
            
            # Add new worksheet
            summary_sheet = spreadsheet.add_worksheet(title="Strategy Summary", rows=50, cols=2)
            
            # Write summary data
            summary_sheet.append_row(["Key", "Value"])
            summary_sheet.append_row(["Dominant Sentiment", summary.get('dominant_sentiment', '')])
            summary_sheet.append_row(["Recommended Tone", summary.get('tone_recommendation', '')])
            summary_sheet.append_row(["Psychology Synthesis", summary.get('psychology_synthesis', '')[:200]])
            summary_sheet.append_row(["Content Strategy", summary.get('content_strategy', '')[:200]])
            
            # Add top hooks
            summary_sheet.append_row(["", ""])
            summary_sheet.append_row(["Top Hooks", ""])
            for i, hook in enumerate(summary.get('top_hooks', []), 1):
                summary_sheet.append_row([f"Hook {i}", hook[:150]])
            
            # Add red flags
            summary_sheet.append_row(["", ""])
            summary_sheet.append_row(["Red Flags / Things to Avoid", ""])
            for i, flag in enumerate(summary.get('red_flags', []), 1):
                summary_sheet.append_row([f"⚠ Flag {i}", flag[:150]])
            
            logger.info("Strategy summary sheet created")
            return True
            
        except Exception as e:
            logger.error(f"Error creating summary sheet: {str(e)}")
            return False
    
    def get_spreadsheet_url(self, spreadsheet_id: str) -> str:
        """Get the Google Sheets URL"""
        return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit"


class SheetsConfig:
    """Configuration for Sheets integration"""
    
    REQUIRED_SETUP = {
        "google_credentials": "Download from Google Cloud Console (Service Account JSON)",
        "spreadsheet_access": "Ensure service account has Editor permissions on target sheets"
    }
    
    @staticmethod
    def get_setup_instructions() -> str:
        return """
GOOGLE SHEETS INTEGRATION SETUP:

1. Create a Google Cloud Project:
   - Go to console.cloud.google.com
   - Create new project "CatalystOS"

2. Enable APIs:
   - Enable Google Sheets API
   - Enable Google Drive API

3. Create Service Account:
   - Go to Credentials → Create Credentials → Service Account
   - Create JSON key and download to ./google-credentials.json

4. Set environment variable:
   - export GOOGLE_SHEETS_CREDENTIALS="./google-credentials.json"

5. (Optional) Share existing sheet with service account email:
   - Get email from credentials JSON (client_email field)
   - Share sheet with that email

Then you're ready to use CatalystSheetsHandler!
"""
