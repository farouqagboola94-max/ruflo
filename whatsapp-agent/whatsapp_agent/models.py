from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class BroadcastRequest(BaseModel):
    message: str
    phone_numbers: List[str]  # list of E.164 phone numbers, or ["all"]


class Lead(BaseModel):
    id: int
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    interest: Optional[str] = None
    created_at: str


class Appointment(BaseModel):
    id: int
    lead_phone: str
    service: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: str


class Broadcast(BaseModel):
    id: int
    message: str
    recipients_count: int
    sent_at: str
