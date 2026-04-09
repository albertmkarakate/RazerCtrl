import asyncio
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from .openrazer_service import OpenRazerService
from .inputremapper_service import InputRemapperService
from .profile_store import ProfileStore
from .macro_recorder import MacroRecorder

app = FastAPI(title="RazerCtrl API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

razer_service = OpenRazerService()
remap_service = InputRemapperService()
profile_store = ProfileStore()

# --- Models ---

class LightingRequest(BaseModel):
    serial: str
    zone: str = "matrix"
    effect: str
    colour_hex: str = "#00ff41"
    speed: int = 2
    direction: str = "right"

class PerformanceRequest(BaseModel):
    serial: str
    dpi_x: Optional[int] = None
    dpi_y: Optional[int] = None
    poll_rate: Optional[int] = None

class RemapRequest(BaseModel):
    device_name: str
    preset_name: str
    mappings: List[dict]

class ProfileRequest(BaseModel):
    name: str
    data: dict

# --- Endpoints ---

@app.get("/api/devices")
async def get_devices():
    try:
        return razer_service.get_devices()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.get("/api/device/{serial}")
async def get_device(serial: str):
    state = razer_service.get_device_state(serial)
    if not state:
        raise HTTPException(status_code=404, detail="Device not found")
    return state

@app.post("/api/lighting")
async def set_lighting(request: LightingRequest):
    if not razer_service.set_lighting(
        request.serial, request.zone, request.effect, 
        request.colour_hex, request.speed, request.direction
    ):
        raise HTTPException(status_code=400, detail="Failed to set lighting")
    return {"status": "success"}

@app.post("/api/performance")
async def set_performance(request: PerformanceRequest):
    if not razer_service.set_performance(
        request.serial, request.dpi_x, request.dpi_y, request.poll_rate
    ):
        raise HTTPException(status_code=400, detail="Failed to set performance")
    return {"status": "success"}

# --- input-remapper ---

@app.get("/api/remap/{device_name}")
async def list_presets(device_name: str):
    return remap_service.list_presets(device_name)

@app.post("/api/remap")
async def save_preset(request: RemapRequest):
    if remap_service.save_preset(request.device_name, request.preset_name, request.mappings):
        remap_service.start_injection(request.device_name, request.preset_name)
        return {"status": "success"}
    raise HTTPException(status_code=500, detail="Failed to save preset")

@app.post("/api/remap/stop")
async def stop_remap(device_name: str):
    remap_service.stop_injection(device_name)
    return {"status": "success"}

# --- Profiles ---

@app.get("/api/profiles")
async def list_profiles():
    return profile_store.list_profiles()

@app.post("/api/profiles")
async def save_profile(request: ProfileRequest):
    profile_store.save_profile(request.name, request.data)
    return {"status": "success"}

@app.delete("/api/profiles/{name}")
async def delete_profile(name: str):
    if profile_store.delete_profile(name):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Profile not found")

# --- Macro WebSocket ---

@app.websocket("/ws/macro-record")
async def websocket_macro_record(websocket: WebSocket):
    await websocket.accept()
    
    # In a real scenario, we'd need to know which device to listen to.
    # For now, we assume the first available input device or a specific path.
    # This would be improved by passing the device path in the connection.
    device_path = "/dev/input/event0" # Placeholder, should be dynamic
    
    recorder = MacroRecorder(device_path)
    
    try:
        # Start recording in a background task
        recording_task = asyncio.create_task(recorder.record())
        
        while True:
            # Check for messages from frontend
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=0.1)
                if data.get("command") == "stop":
                    recorder.stop()
                    events = await recording_task
                    await websocket.send_json({"status": "finished", "events": events})
                    break
            except asyncio.TimeoutError:
                # No message, just stream current events if any
                if recorder.events:
                    # Send new events since last check
                    # (This is a simplified streaming logic)
                    await websocket.send_json({"status": "recording", "events": recorder.events[-1:]})
                    
            await asyncio.sleep(0.01)
            
    except WebSocketDisconnect:
        recorder.stop()
    except Exception as e:
        await websocket.send_json({"status": "error", "detail": str(e)})
    finally:
        await websocket.close()
