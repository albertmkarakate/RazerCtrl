import asyncio
import json
from evdev import InputDevice, categorize, ecodes

class MacroRecorder:
    def __init__(self, device_path):
        self.device = InputDevice(device_path)
        self.recording = False
        self.events = []

    async def record(self):
        self.recording = True
        self.events = []
        async for event in self.device.async_read_loop():
            if not self.recording:
                break
            if event.type == ecodes.EV_KEY:
                self.events.append({
                    "type": event.type,
                    "code": event.code,
                    "value": event.value,
                    "timestamp": event.timestamp()
                })
        return self.events

    def stop(self):
        self.recording = False
