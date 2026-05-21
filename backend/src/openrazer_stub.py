class OpenRazerService:
    """Mock service for testing without hardware"""

    def __init__(self):
        self.manager = None
        self._mock_devices = [
            {
                "id": "viper-mock-001",
                "name": "Razer Viper Ultimate",
                "type": "mouse",
                "vid_pid": "1532:007c",
                "capabilities": {
                    "has_lighting": True,
                    "has_dpi": True,
                    "has_poll_rate": True,
                    "has_matrix": True,
                    "max_dpi": 20000
                }
            },
            {
                "id": "blackwidow-mock-001",
                "name": "Razer BlackWidow V3 Pro",
                "type": "keyboard",
                "vid_pid": "1532:0241",
                "capabilities": {
                    "has_lighting": True,
                    "has_dpi": False,
                    "has_poll_rate": False,
                    "has_matrix": True,
                    "max_dpi": None
                }
            }
        ]

    def check_daemon(self):
        return True

    def get_devices(self):
        return self._mock_devices

    def get_device_state(self, serial):
        for dev in self._mock_devices:
            if dev["id"] == serial:
                return {**dev, "battery": 85, "dpi": 16000, "poll_rate": 1000}
        return None

    def set_lighting(self, serial, zone, effect, colour_hex, speed, direction):
        return True

    def set_performance(self, serial, dpi_x, dpi_y, poll_rate):
        return True


class InputRemapperService:
    def list_presets(self, device_name):
        return []

    def save_preset(self, device_name, preset_name, mappings):
        return True

    def start_injection(self, device_name, preset_name):
        pass

    def stop_injection(self, device_name):
        pass


class ProfileStore:
    def __init__(self):
        self._profiles = {}

    def list_profiles(self):
        return list(self._profiles.keys())

    def save_profile(self, name, data):
        self._profiles[name] = data
        return True

    def delete_profile(self, name):
        if name in self._profiles:
            del self._profiles[name]
            return True
        return False


class MacroRecorder:
    def __init__(self, device_path):
        self.events = []
        self._recording = False

    async def record(self):
        self._recording = True
        return self.events

    def stop(self):
        self._recording = False