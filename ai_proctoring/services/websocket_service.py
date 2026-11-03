import json

from fastapi import WebSocket


class WebSocketService:
    async def send_event(self, websocket: WebSocket, event_type, data):
        message = {
            "event": event_type,
            "data": data
        }

        await websocket.send_text(json.dumps(message))

    async def receive_message(self, websocket: WebSocket):
        try:
            message = await websocket.receive_text()
            return json.loads(message)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON message"}