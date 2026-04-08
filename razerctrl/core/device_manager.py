import logging
from typing import List, Optional
try:
    import openrazer.client
    from openrazer.client import DeviceManager as RazerDeviceManager
except ImportError:
    openrazer = None
    RazerDeviceManager = None

from .hardware_info import hardware_info, is_razer_device


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
            discovered = self.manager.devices
            self.devices = [device for device in discovered if self.is_razer_hardware(device)]
        except Exception as e:
            logging.error(f"Error refreshing devices: {e}")
            self.devices = []

    def get_device_by_serial(self, serial: str):
        """Returns a device instance by its serial number."""
        for device in self.devices:
            if device.serial == serial:
                return device
        return None

    def get_device_hardware_info(self, device) -> dict:
        """Read hardware info fields from a device for diagnostics/verification."""
        return hardware_info(device)

    def is_razer_hardware(self, device) -> bool:
        """Verify whether a detected device belongs to Razer vendor IDs."""
        return is_razer_device(device)

    def is_daemon_running(self) -> bool:
        """Checks if the openrazer-daemon is responsive."""
        if not self.connected or self.manager is None:
            return False
        try:
            # Perform a lightweight live check by querying the daemon
            _ = self.manager.devices
            return True
        except Exception:
            self.connected = False
            return False
