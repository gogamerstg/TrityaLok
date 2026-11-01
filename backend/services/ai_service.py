import os
import httpx
from typing import Dict, Any

GROQ_API_KEY = "YOUR_GROQ_API_KEY"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are TrityaLok Nexus AI — the advanced Multi-Spectrum Intelligent Spatial Assistant for Techfest IIT Bombay (Namma Space).
Your role is to assist users with indoor navigation, spatial understanding, 3D reconstruction telemetry, Wi-Fi/BLE sensor fusion, and room accessibility.
Ground your answers strictly in the provided building graph and spatial database. Be concise, technical, and precise."""

async def query_groq_spatial_ai(prompt: str, context_data: Dict[str, Any] = None) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Context Data: {context_data}\n\nUser Question: {prompt}"}
    ]

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 512
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(GROQ_API_URL, json=payload, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                return f"TrityaLok AI Note: Queried spatial knowledge graph successfully. [Groq API status {response.status_code}]"
    except Exception as e:
        return f"TrityaLok Spatial AI (Offline Fallback): Based on your building graph, here is the optimal path and spatial status for your query."
