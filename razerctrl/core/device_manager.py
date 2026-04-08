import logging
from typing import List, Optional
try:
    import openrazer.client
    from openrazer.client import DeviceManager as RazerDeviceManager
except ImportError:
    openrazer = None
    RazerDeviceManager = None

class DeviceManager:
    """
    Handles interaction with the openrazer-daemon.
    """
    def __init__(self):
        self.manager = None
        self.connected = False
        self.devices = []
        self.initialize()

    def initialize(self):
        """Initializes the openrazer device manager."""
        if RazerDeviceManager is None:
            logging.error("openrazer-client not installed.")
            return

        try:
            self.manager = RazerDeviceManager()
            # Turn off sync effects by default to allow per-device control
            self.manager.sync_effects = False
            self.connected = True
            self.refresh_devices()
        except Exception as e:
            logging.error(f"Failed to connect to openrazer-daemon: {e}")
            self.connected = False

    def refresh_devices(self):
        """Refreshes the list of connected Razer devices."""
        if not self.connected:
            return
        
        try:
            self.devices = self.manager.devices
        except Exception as e:
            logging.error(f"Error refreshing devices: {e}")
            self.devices = []

    def get_device_by_serial(self, serial: str):
        """Returns a device instance by its serial number."""
        for device in self.devices:
            if device.serial == serial:
                return device
        return None

    def is_daemon_running(self) -> bool:
        """Checks if the openrazer-daemon is responsive."""
        return self.connected
