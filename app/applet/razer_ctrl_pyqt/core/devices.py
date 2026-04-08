import urllib.request
import os

try:
    from openrazer.client import DeviceManager
    OPENRAZER_AVAILABLE = True
except ImportError:
    OPENRAZER_AVAILABLE = False
    print("Warning: openrazer module not found. Using mock devices.")

class RazerDeviceManager:
    def __init__(self):
        if OPENRAZER_AVAILABLE:
            try:
                self.manager = DeviceManager()
                self.devices = self.manager.devices
            except Exception as e:
                print(f"OpenRazer daemon not found or error: {e}")
                self.manager = None
                self.devices = []
        else:
            self.manager = None
            self.devices = []

    def refresh(self):
        if self.manager:
            self.devices = self.manager.devices
        return self.devices

    def get_devices_by_type(self):
        """
        Returns:
            {
                "mouse": [...],
                "keyboard": [...],
                "headset": [...]
            }
        """
        device_map = {
            "mouse": [],
            "keyboard": [],
            "headset": [],
        }

        for device in self.devices:
            name = device.name.lower()

            if "mouse" in name:
                device_map["mouse"].append(device)
            elif "keyboard" in name:
                device_map["keyboard"].append(device)
            elif "headset" in name or "kraken" in name:
                device_map["headset"].append(device)

        return device_map

def get_device_image_path(device_name, device_type):
    """
    Returns the path to the device image.
    Downloads a topographic placeholder if it doesn't exist.
    """
    assets_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "devices")
    os.makedirs(assets_dir, exist_ok=True)
    
    safe_name = device_name.replace(" ", "")
    file_path = os.path.join(assets_dir, f"{safe_name}.jpg")
    
    if not os.path.exists(file_path):
        # Generate topographic image url based on device name
        url = f"https://picsum.photos/seed/{safe_name}Topo/256/256?grayscale&blur=2"
        try:
            print(f"Downloading asset for {device_name}...")
            urllib.request.urlretrieve(url, file_path)
        except Exception as e:
            print(f"Failed to download image for {device_name}: {e}")
            return None
            
    return file_path
