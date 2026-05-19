import os
import json
from typing import List, Optional

class ProfileStore:
    def __init__(self):
        self.profile_dir = os.path.expanduser("~/.config/razerctrl/profiles")
        os.makedirs(self.profile_dir, exist_ok=True)

    def list_profiles(self) -> List[str]:
        return [f.replace('.json', '') for f in os.listdir(self.profile_dir) if f.endswith('.json')]

    def get_profile(self, name: str) -> Optional[dict]:
        path = os.path.join(self.profile_dir, f"{name}.json")
        if not os.path.exists(path):
            return None
        with open(path, 'r') as f:
            return json.load(f)

    def save_profile(self, name: str, profile_data: dict):
        path = os.path.join(self.profile_dir, f"{name}.json")
        with open(path, 'w') as f:
            json.dump(profile_data, f, indent=2)
        return True

    def delete_profile(self, name: str):
        path = os.path.join(self.profile_dir, f"{name}.json")
        if os.path.exists(path):
            os.remove(path)
            return True
        return False
