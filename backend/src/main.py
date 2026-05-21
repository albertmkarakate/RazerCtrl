import asyncio
import logging
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from .openrazer_service import OpenRazerService
except Exception:
    from .openrazer_stub import OpenRazerService

try:
    from .inputremapper_service import InputRemapperService
except Exception:
    from .openrazer_stub import InputRemapperService

try:
    from .profile_store import ProfileStore
except Exception:
    from .openrazer_stub import ProfileStore

try:
    from .macro_recorder import MacroRecorder
except Exception:
    from .openrazer_stub import MacroRecorder

app = FastAPI(title="RazerCtrl API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    razer_service = OpenRazerService()
except Exception:
    from .openrazer_stub import OpenRazerService
    razer_service = OpenRazerService()

remap_service = InputRemapperService()
profile_store = ProfileStore()
macro_recorder: Optional[MacroRecorder] = None
macro_recording_task: Optional[asyncio.Task] = None


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


@app.get("/set_color/{color_name}")
async def set_color_simple(color_name: str):
    colors = {
        "green": "#00ff41",
        "red": "#ff0000",
        "blue": "#0000ff",
        "white": "#ffffff",
        "off": "#000000"
    }
    hex_color = colors.get(color_name.lower(), "#00ff41")

    devices = razer_service.get_devices()
    results = []
    for dev in devices:
        res = razer_service.set_lighting(dev['id'], "matrix", "static", hex_color, 2, "right")
        results.append({"device": dev['name'], "success": res})

    return {"status": "success", "color": color_name, "results": results}


@app.get("/api/devices")
async def get_devices():
    try:
        return razer_service.get_devices()
    except RuntimeError as e:
        logger.warning(f"Device fetch failed: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error fetching devices: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/device/{serial}")
async def get_device(serial: str):
    try:
        state = razer_service.get_device_state(serial)
        if not state:
            raise HTTPException(status_code=404, detail="Device not found")
        return state
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching device {serial}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/api/lighting")
async def set_lighting(request: LightingRequest):
    try:
        result = razer_service.set_lighting(
            request.serial, request.zone, request.effect,
            request.colour_hex, request.speed, request.direction
        )
        if not result:
            raise HTTPException(status_code=400, detail="Failed to set lighting")
        return {"status": "success"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error setting lighting: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/api/performance")
async def set_performance(request: PerformanceRequest):
    try:
        result = razer_service.set_performance(
            request.serial, request.dpi_x, request.dpi_y, request.poll_rate
        )
        if not result:
            raise HTTPException(status_code=400, detail="Failed to set performance")
        return {"status": "success"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error setting performance: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/remap/{device_name}")
async def list_presets(device_name: str):
    try:
        return remap_service.list_presets(device_name)
    except Exception as e:
        logger.error(f"Error listing presets for {device_name}: {e}")
        raise HTTPException(status_code=500, detail="Failed to list presets")


@app.post("/api/remap")
async def save_preset(request: RemapRequest):
    try:
        if remap_service.save_preset(request.device_name, request.preset_name, request.mappings):
            remap_service.start_injection(request.device_name, request.preset_name)
            return {"status": "success"}
        raise HTTPException(status_code=500, detail="Failed to save preset")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving preset: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/api/remap/stop")
async def stop_remap(device_name: str):
    try:
        remap_service.stop_injection(device_name)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error stopping remap: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/profiles")
async def list_profiles():
    try:
        return profile_store.list_profiles()
    except Exception as e:
        logger.error(f"Error listing profiles: {e}")
        raise HTTPException(status_code=500, detail="Failed to list profiles")


@app.get("/api/profiles/{name}")
async def get_profile(name: str):
    try:
        profile = profile_store.get_profile(name)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile {name}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/api/profiles")
async def save_profile(request: ProfileRequest):
    try:
        profile_store.save_profile(request.name, request.data)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.delete("/api/profiles/{name}")
async def delete_profile(name: str):
    try:
        if profile_store.delete_profile(name):
            return {"status": "success"}
        raise HTTPException(status_code=404, detail="Profile not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.websocket("/ws/macro-record")
async def websocket_macro_record(websocket: WebSocket):
    global macro_recorder, macro_recording_task

    await websocket.accept()
    device_path = "/dev/input/event0"
    macro_recorder = MacroRecorder(device_path)
    recorded_events = []

    try:
        macro_recording_task = asyncio.create_task(macro_recorder.record())

        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=1.0)
                if data.get("command") == "stop":
                    macro_recorder.stop()
                    try:
                        recorded_events = await asyncio.wait_for(macro_recording_task, timeout=2.0)
                    except asyncio.TimeoutError:
                        macro_recording_task.cancel()
                        recorded_events = macro_recorder.events
                    await websocket.send_json({"status": "finished", "events": recorded_events})
                    break
                elif data.get("command") == "status":
                    await websocket.send_json({
                        "status": "recording",
                        "event_count": len(macro_recorder.events)
                    })
            except asyncio.TimeoutError:
                continue
            except WebSocketDisconnect:
                break

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"Macro recording error: {e}")
        try:
            await websocket.send_json({"status": "error", "detail": str(e)})
        except Exception:
            pass
    finally:
        if macro_recorder:
            macro_recorder.stop()
        if macro_recording_task and not macro_recording_task.done():
            macro_recording_task.cancel()
            try:
                await macro_recording_task
            except (asyncio.CancelledError, Exception):
                pass
        macro_recorder = None
        macro_recording_task = None
        try:
            await websocket.close()
        except Exception:
            pass


@app.get("/api/macro/playback")
async def play_macro(device_path: str = "/dev/input/event0"):
    try:
        from evdev import InputDevice, ecodes
        device = InputDevice(device_path)
        for event_data in macro_recorder.events if macro_recorder else []:
            device.write(event_data["type"], event_data["code"], event_data["value"])
            device.syn()
        return {"status": "success", "events_played": len(macro_recorder.events) if macro_recorder else 0}
    except Exception as e:
        logger.error(f"Error playing macro: {e}")
        raise HTTPException(status_code=500, detail=str(e))