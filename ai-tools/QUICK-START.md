# Quick Start Guide

The fastest way to get any tool from this directory running.

---

## Run Your First Local LLM (5 minutes)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (Llama 3.2 3B - runs on any laptop)
ollama pull llama3.2

# Chat with it
ollama run llama3.2
```

---

## Add a Web UI for Ollama

```bash
# Requires Docker
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main

# Open http://localhost:3000
```

---

## Remove Image Backgrounds (rembg)

```bash
pip install rembg[cli]
rembg i input.jpg output.png
```

---

## Transcribe Audio/Video (Whisper)

```bash
pip install openai-whisper
whisper audio.mp4 --model medium --language en
```

---

## Self-Host a Newsletter (Listmonk)

```bash
# Requires Docker + PostgreSQL
docker pull listmonk/listmonk:latest

# Full setup: https://listmonk.app/docs/installation/
```

---

## Self-Host Workflow Automation (Activepieces)

```bash
docker run -d \
  -p 8080:80 \
  -v ~/.activepieces:/root/.activepieces \
  activepieces/activepieces:latest

# Open http://localhost:8080
```

---

## Build a RAG Chatbot (Chroma + LangChain)

```bash
pip install chromadb langchain openai
```

```python
import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings import OllamaEmbeddings

# Store your documents
client = chromadb.Client()
collection = client.create_collection("sneakers-fest")
collection.add(documents=["your docs here"], ids=["1"])

# Query
results = collection.query(query_texts=["What is Sneakers Fest?"], n_results=3)
```

---

## Hardware Requirements

| Use Case | Min RAM | Recommended | GPU |
|----------|---------|-------------|-----|
| Small models (1-4B) | 8GB | 16GB | Optional |
| Medium models (7-13B) | 16GB | 32GB | 8GB VRAM |
| Large models (30-70B) | 64GB | 128GB | 24GB VRAM |
| 405B models | 800GB+ | Cluster | Multi-GPU |
| Photo enhancement | 8GB | 16GB | 4GB VRAM |
| Audio/TTS | 8GB | 16GB | Optional |

---

*For full docs on each tool, see [README.md](./README.md)*
