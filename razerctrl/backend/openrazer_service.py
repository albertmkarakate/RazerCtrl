from openrazer.client import DeviceManager
from openrazer.client import DaemonNotRunningError

class OpenRazerService:
    def __init__(self):
        try:
            self.manager = DeviceManager()
        except DaemonNotRunningError:
            self.manager = None

    def check_daemon(self):
        if self.manager is None:
            try:
                self.manager = DeviceManager()
            except DaemonNotRunningError:
                return False
        return True

    def get_devices(self):
        if not self.check_daemon():
            raise RuntimeError("openrazer daemon not running. Run: sudo systemctl start openrazer-daemon")
        
        devices = []
        for device in self.manager.devices:
            devices.append({
                "id": device.serial,
                "name": device.name,
                "type": self._get_type(device),
                "vid_pid": f"{device.vendor_id:04x}:{device.product_id:04x}",
                "capabilities": {
                    "has_lighting": hasattr(device, 'fx'),
                    "has_dpi": hasattr(device, 'dpi'),
                    "has_poll_rate": hasattr(device, 'poll_rate'),
                    "has_matrix": hasattr(device, 'fx') and hasattr(device.fx, 'advanced'),
                    "max_dpi": getattr(device, 'max_dpi', None)
                }
            })
        return devices

    def _get_type(self, device):
        name = device.name.lower()
        if "mouse" in name: return "mouse"
        if "keyboard" in name: return "keyboard"
        if "headset" in name: return "headset"
        if "keypad" in name: return "keypad"
        if "controller" in name or "raiju" in name: return "gamepad"
        return "other"

    def get_device_state(self, serial):
        device = self._get_device(serial)
        if not device:
            return None
        
        state = {
            "serial": device.serial,
            "name": device.name,
            "battery": getattr(device, 'battery_level', None)
        }
        
        if hasattr(device, 'dpi'):
            state['dpi'] = device.dpi
        if hasattr(device, 'poll_rate'):
            state['poll_rate'] = device.poll_rate
            
        return state

    def set_lighting(self, serial, zone, effect, colour_hex, speed, direction):
        device = self._get_device(serial)
        if not device or not hasattr(device, 'fx'):
            return False
        
        r, g, b = self._hex_to_rgb(colour_hex)
        
        # Implementation of various effects
        try:
            if effect == 'static':
                device.fx.static(r, g, b)
            elif effect == 'spectrum':
                device.fx.spectrum()
            elif effect == 'wave':
                dir_val = 1 if direction == 'right' else 2
                device.fx.wave(dir_val)
            elif effect == 'reactive':
                # speed mapping: 1 (fast), 2 (medium), 3 (slow)
                device.fx.reactive(r, g, b, speed)
            elif effect == 'breath':
                device.fx.breath_single(r, g, b)
            elif effect == 'none':
                device.fx.none()
            return True
        except Exception:
            return False

    def set_performance(self, serial, dpi_x, dpi_y, poll_rate):
        device = self._get_device(serial)
        if not device:
            return False
        
        try:
            if hasattr(device, 'dpi') and dpi_x and dpi_y:
                device.dpi = (dpi_x, dpi_y)
            if hasattr(device, 'poll_rate') and poll_rate:
                device.poll_rate = poll_rate
            return True
        except Exception:
            return False

    def _get_device(self, serial):
        if not self.check_daemon():
            return None
        for device in self.manager.devices:
            if device.serial == serial:
                return device
        return None

    def _hex_to_rgb(self, hex_str):
        hex_str = hex_str.lstrip('#')
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
