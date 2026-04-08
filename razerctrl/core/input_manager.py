import logging
import shlex
import threading
import time
import subprocess
import shutil
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
                    # keycode can be a list when multiple names share a scancode
                    if isinstance(key_name, list):
                        key_name = key_name[0]
                    # event.value: 1 for down, 0 for up, 2 for hold
                    self.callback({
                        "key": key_name,
                        "value": event.value,
                        "delay": delay
                    })

        except Exception as e:
            if self.running:
                logging.error(f"Macro recorder error: {e}")
        finally:
            self._cleanup()

    def stop(self):
        self.running = False
        # Close device to interrupt blocking read_loop()
        if self.device:
            try:
                self.device.close()
            except OSError:
                pass

    def _cleanup(self):
        self.running = False
        if self.device:
            try:
                self.device.close()
            except OSError:
                pass

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
            if self.running:
                logging.error(f"Input mapper error: {e}")
        finally:
            self._cleanup()

    def handle_key_event(self, event):
        """Handles a key event and applies remapping rules."""
        key_name = evdev.categorize(event).keycode
        # keycode can be a list when multiple names share a scancode
        if isinstance(key_name, list):
            key_name = key_name[0]
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
            try:
                subprocess.Popen(shlex.split(value))
            except (ValueError, OSError) as e:
                logging.error(f"Failed to execute command action: {e}")

    def stop(self):
        self.running = False
        # Close device to interrupt blocking read_loop()
        if self.device:
            try:
                self.device.close()
            except OSError:
                pass

    def _cleanup(self):
        self.running = False
        if self.device:
            try:
                self.device.ungrab()
            except OSError:
                pass
            try:
                self.device.close()
            except OSError:
                pass
        if self.uinput:
            try:
                self.uinput.close()
            except OSError:
                pass

class InputManager:
    """
    Manages input device discovery and mapper threads.
    """
    def __init__(self):
        self.active_mappers: Dict[str, InputMapperThread] = {}
        self.active_recorder: Optional[MacroRecorderThread] = None

    def has_input_remapper(self) -> bool:
        """Returns True when input-remapper CLI and GTK frontend are installed."""
        return bool(shutil.which("input-remapper-control")) and bool(shutil.which("input-remapper-gtk"))

    def open_input_remapper_ui(self, debug: bool = False):
        """Launches the upstream input-remapper GTK UI."""
        cmd = ["input-remapper-gtk"]
        if debug:
            cmd.append("-d")
        subprocess.Popen(cmd)

    def list_input_remapper_devices(self) -> List[str]:
        """Returns user-facing device names from input-remapper-control."""
        if not shutil.which("input-remapper-control"):
            return []
        try:
            result = subprocess.run(
                ["input-remapper-control", "--list-devices"],
                capture_output=True,
                text=True,
                check=True,
            )
            devices = []
            for line in result.stdout.splitlines():
                line = line.strip()
                if line.startswith("Found "):
                    devices.append(line.replace("Found ", "", 1).strip().strip('"'))
            return devices
        except subprocess.CalledProcessError as exc:
            logging.warning("Failed to list input-remapper devices: %s", exc)
            return []

    def apply_input_remapper_preset(self, device_name: str, preset_name: str) -> tuple[bool, str]:
        """Starts preset injection for a device via input-remapper-control."""
        if not shutil.which("input-remapper-control"):
            return False, "input-remapper-control is not installed."

        if not device_name or not preset_name:
            return False, "Please select a device and preset."

        cmd = [
            "input-remapper-control",
            "--command",
            "start",
            "--device",
            device_name,
            "--preset",
            preset_name,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            return True, (result.stdout.strip() or "Preset applied.")
        return False, (result.stderr.strip() or result.stdout.strip() or "Failed to apply preset.")

    def stop_input_remapper(self, device_name: str) -> tuple[bool, str]:
        """Stops active injection for the selected input-remapper device."""
        if not shutil.which("input-remapper-control"):
            return False, "input-remapper-control is not installed."
        if not device_name:
            return False, "Please select a device."
        result = subprocess.run(
            ["input-remapper-control", "--command", "stop", "--device", device_name],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            return True, (result.stdout.strip() or "Injection stopped.")
        return False, (result.stderr.strip() or result.stdout.strip() or "Failed to stop injection.")

    def list_devices(self) -> List[dict]:
        """Lists all available input devices."""
        if evdev is None:
            return []
        
        devices = []
        for path in evdev.list_devices():
            dev = evdev.InputDevice(path)
            try:
                devices.append({
                    "path": path,
                    "name": dev.name,
                    "phys": dev.phys
                })
            finally:
                dev.close()
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
