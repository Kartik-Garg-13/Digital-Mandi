from fastapi import FastAPI, WebSocket, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import asyncio
import os
from datetime import datetime, timedelta
from typing import List, Optional
import uvicorn
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import json

# Import models and routes
from models import *
from database import get_db, engine
from routes import listings
from services.whatsapp_service import WhatsAppService

app = FastAPI(
    title="🚜 Digital Mandi API",
    description="WhatsApp-first farmer marketplace by Kartik Singh",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(listings.router, prefix="/api/listings", tags=["listings"])

# Services
whatsapp_service = WhatsAppService()

# WebSocket for real-time updates
connected_clients = {}

@app.websocket("/ws/listings/{listing_id}")
async def websocket_endpoint(websocket: WebSocket, listing_id: str):
    await websocket.accept()
    if listing_id not in connected_clients:
        connected_clients[listing_id] = []
    connected_clients[listing_id].append(websocket)
    
    try:
        while True:
            await websocket.receive_text()
    except:
        connected_clients[listing_id].remove(websocket)

async def broadcast_bid_update(listing_id: str, bid_data: dict):
    """Broadcast bid updates to connected clients"""
    if listing_id in connected_clients:
        for websocket in connected_clients[listing_id]:
            try:
                await websocket.send_json(bid_data)
            except:
                connected_clients[listing_id].remove(websocket)

# WhatsApp Webhook
@app.post("/webhook/whatsapp")
async def whatsapp_webhook(request: dict, background_tasks: BackgroundTasks):
    """Handle incoming WhatsApp messages"""
    try:
        message_body = request.get("Body", "").strip().upper()
        from_number = request.get("From", "").replace("whatsapp:", "")
        
        background_tasks.add_task(
            whatsapp_service.handle_message, 
            message_body, 
            from_number
        )
        
        return {"status": "success"}
    except Exception as e:
        print(f"WhatsApp webhook error: {e}")
        return {"status": "error", "message": str(e)}

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "creator": "Kartik Singh - 17 year old BTech CSE student at MUJ",
        "features": [
            "WhatsApp Integration",
            "Real-time Bidding",
            "MSP Alerts",
            "Collective Pooling",
            "Trust Scoring",
            "Logistics Optimization",
            "Price Forecasting",
            "Multi-language Support"
        ]
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and services"""
    print("🚜 Starting Digital Mandi API by Kartik Singh...")
    
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database initialized")
    print("✅ WhatsApp service ready")
    print("✅ Real-time WebSocket ready")
    print("🌾 Digital Mandi API is live!")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)