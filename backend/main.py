from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import io, tempfile, os

app = FastAPI(title="Sneakers Fest AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
