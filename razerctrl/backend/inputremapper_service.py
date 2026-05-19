import subprocess
import json
import os

class InputRemapperService:
    def __init__(self):
        self.preset_dir = os.path.expanduser("~/.config/input-remapper-2/presets")

    def list_presets(self, device_name):
        device_preset_dir = os.path.join(self.preset_dir, device_name)
        if not os.path.exists(device_preset_dir):
            return []
        return [f.replace('.json', '') for f in os.listdir(device_preset_dir) if f.endswith('.json')]

    def save_preset(self, device_name, preset_name, mappings):
        device_preset_dir = os.path.join(self.preset_dir, device_name)
        os.makedirs(device_preset_dir, exist_ok=True)
        preset_path = os.path.join(device_preset_dir, f"{preset_name}.json")
        with open(preset_path, 'w') as f:
            json.dump({"mappings": mappings}, f)
        return True

    def start_injection(self, device_name, preset_name):
        subprocess.run(["input-remapper-control", "--command", "start", "--device", device_name, "--preset", preset_name])
        return True

    def stop_injection(self, device_name):
        subprocess.run(["input-remapper-control", "--command", "stop", "--device", device_name])
        return True
