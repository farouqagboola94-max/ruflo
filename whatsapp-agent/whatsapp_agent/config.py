import os
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_TOKEN: str = os.getenv("WHATSAPP_TOKEN", "")
WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
WHATSAPP_VERIFY_TOKEN: str = os.getenv("WHATSAPP_VERIFY_TOKEN", "ruflo-verify-token")
ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "")
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./whatsapp_agent.db")


def _db_path(url: str) -> str:
    if url.startswith("sqlite:///./"):
        return url[len("sqlite:///./"):]
    if url.startswith("sqlite:///"):
        return url[len("sqlite:///"):]
    return url


DATABASE_PATH: str = _db_path(DATABASE_URL)
