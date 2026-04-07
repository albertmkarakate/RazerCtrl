import logging
import threading
import time
from typing import Dict, List, Optional, Callable
try:
    import evdev
    from evdev import ecodes, UInput
except ImportError:
    evdev = None

class MacroRecorderThread(threading.Thread):
    """
    Background thread for recording key presses and delays.
    """
    def __init__(self, device_path: str, callback: Callable[[dict], None]):
        super().__init__(daemon=True)
        self.device_path = device_path
        self.callback = callback
        self.running = False
        self.device = None

    def run(self):
        if evdev is None:
            return

        try:
            self.device = evdev.InputDevice(self.device_path)
            self.running = True
            last_time = time.time()
            
            logging.info(f"Started macro recorder on {self.device.name}")

            for event in self.device.read_loop():
                if not self.running:
                    break
                
                if event.type == ecodes.EV_KEY:
                    current_time = time.time()
                    delay = int((current_time - last_time) * 1000)
                    last_time = current_time
                    
                    key_name = evdev.categorize(event).keycode
                    # event.value: 1 for down, 0 for up, 2 for hold
                    self.callback({
                        "key": key_name,
                        "value": event.value,
                        "delay": delay
                    })

        except Exception as e:
            logging.error(f"Macro recorder error: {e}")
        finally:
            self.stop()

    def stop(self):
        self.running = False

class InputMapperThread(threading.Thread):
    """
    Background thread for monitoring input events and applying remapping rules.
    """
    def __init__(self, device_path: str, rules: List[dict]):
        super().__init__(daemon=True)
        self.device_path = device_path
        self.rules = rules
        self.running = False
        self.uinput = None
        self.device = None

    def run(self):
        if evdev is None:
            return

        try:
            self.device = evdev.InputDevice(self.device_path)
            self.device.grab() # Exclusive access
            
            # Create virtual device for output
            # We need to define which events the virtual device supports
            # For simplicity, we'll support common keys
            self.uinput = UInput()
            
            self.running = True
            logging.info(f"Started input mapper on {self.device.name}")

            for event in self.device.read_loop():
                if not self.running:
                    break
                
                if event.type == ecodes.EV_KEY:
                    self.handle_key_event(event)
                else:
                    # Pass through other events (like mouse movement)
                    self.uinput.write_event(event)
                    self.uinput.syn()

        except Exception as e:
            logging.error(f"Input mapper error: {e}")
        finally:
            self.stop()

    def handle_key_event(self, event):
        """Handles a key event and applies remapping rules."""
        key_name = evdev.categorize(event).keycode
        # Check if any rule matches this key
        matched = False
        for rule in self.rules:
            if rule.get("trigger") == key_name and rule.get("enabled"):
                self.execute_action(rule.get("action"))
                matched = True
                break
        
        if not matched:
            # Pass through if no rule matches
            self.uinput.write(ecodes.EV_KEY, event.code, event.value)
            self.uinput.syn()

    def execute_action(self, action: dict):
        """Executes the action defined in a mapping rule."""
        action_type = action.get("type")
        value = action.get("value")

        if action_type == "remap":
            # value would be a key code like ecodes.KEY_A
            self.uinput.write(ecodes.EV_KEY, value, 1)
            self.uinput.write(ecodes.EV_KEY, value, 0)
            self.uinput.syn()
        elif action_type == "command":
            import subprocess
            subprocess.Popen(value, shell=True)

    def stop(self):
        self.running = False
        if self.device:
            try:
                self.device.ungrab()
            except:
                pass
        if self.uinput:
            self.uinput.close()

class InputManager:
    """
    Manages input device discovery and mapper threads.
    """
    def __init__(self):
        self.active_mappers: Dict[str, InputMapperThread] = {}
        self.active_recorder: Optional[MacroRecorderThread] = None

    def list_devices(self) -> List[dict]:
        """Lists all available input devices."""
        if evdev is None:
            return []
        
        devices = []
        for path in evdev.list_devices():
            dev = evdev.InputDevice(path)
            devices.append({
                "path": path,
                "name": dev.name,
                "phys": dev.phys
            })
        return devices

    def start_mapper(self, device_path: str, rules: List[dict]):
        """Starts a mapper thread for a specific device."""
        if device_path in self.active_mappers:
            self.stop_mapper(device_path)
        
        thread = InputMapperThread(device_path, rules)
        thread.start()
        self.active_mappers[device_path] = thread

    def stop_mapper(self, device_path: str):
        """Stops a mapper thread for a specific device."""
        if device_path in self.active_mappers:
            self.active_mappers[device_path].stop()
            del self.active_mappers[device_path]

    def start_recording(self, device_path: str, callback: Callable[[dict], None]):
        """Starts recording macros from a specific device."""
        self.stop_recording()
        self.active_recorder = MacroRecorderThread(device_path, callback)
        self.active_recorder.start()

    def stop_recording(self):
        """Stops the current macro recording."""
        if self.active_recorder:
            self.active_recorder.stop()
            self.active_recorder = None
