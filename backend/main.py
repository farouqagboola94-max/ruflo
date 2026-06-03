from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List
import io, tempfile, os

SF26_SYSTEM = """You are the official AI concierge for Sneakers Fest '26 — The Sole Exhibition, Lagos.
Speak in short, punchy replies (2–4 sentences max). Lagos streetwear energy, confident, knowledgeable.

KEY FACTS:
- Event: December 12, 2026, Lagos Nigeria (exact venue TBA — WhatsApp channel gets first notice)
- Tickets: General ₦5,000 · VIP ₦10,000 · VVIP ₦25,000 · Phalanx ₦50,000
- VIP: Priority entry + exclusive lounge + merch bag
- VVIP: Everything VIP + private collector room + artist meet-greet + signed merch
- Phalanx: Top tier — private lounge, dedicated concierge, exclusive badge + collectible box, early entry 11 AM
- Headliner: DJ Spinall
- Vendor spots: 30–50 stalls, invitation-curated, apply via site Vendors section
- Sponsors: packages ₦250K (Community) to ₦5M+ (Headline); FNP from ₦100K
- Friday Night Protocol: weekly community session every Friday — drop discussions, challenges, games
- Early Access: sign up on site for queue position + first dibs on tickets/vendor spots
- Founder: Oluwatobiloba — The Catalyst, principal of Catalyst Concepts, Lagos
- Contact: WhatsApp button on site (fastest) · press@sneakersfest.com · sponsors@sneakersfest.com
- YouTube: @catalyst00555 · Twitter: @Catalyst188 · Substack: @catalyst00555
- Merch: Lagos Noir aesthetic, available in Merch section
- Raffle: enter to win exclusive sneakers, draws happen live at event
- Gallery: upload and share sneaker photos for community heat ranking
- Trade Board: post and browse sneaker trades, contact sellers via WhatsApp
- Museum: bid on limited artwork — Lagos At Dawn, Sole Supremacy, Neon Void I, The Movement, etc.
- Catalyst Universe Comics: lore-building comic series around the event world

If asked something you don't know, direct to WhatsApp or email. Never fabricate dates, prices, or partnerships not listed above."""

app = FastAPI(title="Sneakers Fest AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """AI chat powered by Claude — Sneakers Fest concierge."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="ANTHROPIC_API_KEY not configured")
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        msgs = [{"role": m.role, "content": m.content} for m in req.messages[-8:]]
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=350,
            system=SF26_SYSTEM,
            messages=msgs,
        )
        return JSONResponse({"reply": response.content[0].text})
    except ImportError:
        raise HTTPException(status_code=500, detail="anthropic not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health():
    return {"status": "ok", "service": "Sneakers Fest AI Backend", "tools": ["rembg", "whisper"]}

@app.post("/api/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    """Remove background from sneaker photos using rembg."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    try:
        from rembg import remove
        contents = await file.read()
        result = remove(contents)
        return StreamingResponse(
            io.BytesIO(result),
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=sneaker-nobg.png"}
        )
    except ImportError:
        raise HTTPException(status_code=500, detail="rembg not installed. Run: pip install rembg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe audio/video files using OpenAI Whisper."""
    ext = os.path.splitext(file.filename or "audio.mp3")[1] or ".mp3"
    try:
        import whisper
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        try:
            model = whisper.load_model(os.getenv("WHISPER_MODEL", "base"))
            result = model.transcribe(tmp_path)
            return JSONResponse({
                "text": result["text"],
                "language": result.get("language", "en"),
                "segments": len(result.get("segments", []))
            })
        finally:
            os.unlink(tmp_path)
    except ImportError:
        raise HTTPException(status_code=500, detail="whisper not installed. Run: pip install openai-whisper")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
