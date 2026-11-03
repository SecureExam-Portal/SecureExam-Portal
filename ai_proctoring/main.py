from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from services.websocket_service import WebSocketService
from services.violation_manager import ViolationManager

app = FastAPI(
    title="SecureExam-AI Proctoring API",
    description="AI-assisted online examination monitoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

websocket_service = WebSocketService()
violation_manager = ViolationManager()


@app.get("/")
async def home():
    return {
        "message": "SecureExam-AI Proctoring API is running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }


@app.get("/violations")
async def get_violations():
    return {
        "count": violation_manager.get_violation_count(),
        "violations": violation_manager.get_violations()
    }


@app.websocket("/ws/proctoring")
async def proctoring_websocket(websocket: WebSocket):
    await websocket.accept()

    await websocket_service.send_event(
        websocket,
        "connected",
        {"message": "Proctoring connection established"}
    )

    try:
        while True:
            message = await websocket_service.receive_message(websocket)

            if "error" in message:
                await websocket_service.send_event(
                    websocket, "error", message
                )
                continue

            event_type = message.get("event")

            if event_type == "ping":
                await websocket_service.send_event(
                    websocket, "pong", {}
                )
                continue

            violation = violation_manager.record_violation(
                event_type or "unknown_event",
                message.get("data", {})
            )

            await websocket_service.send_event(
                websocket,
                "violation_recorded",
                violation
            )

    except WebSocketDisconnect:
        print("Proctoring WebSocket disconnected")