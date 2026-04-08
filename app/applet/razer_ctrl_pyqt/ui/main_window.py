from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QStackedWidget, QLabel
)
from PyQt6.QtCore import Qt
from ui.device_bar import DeviceBar
from ui.panels.mouse_panel import MousePanel
from ui.panels.keyboard_panel import KeyboardPanel
from ui.panels.headset_panel import HeadsetPanel
from core.devices import RazerDeviceManager

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("RazerCtrl")
        self.setMinimumSize(900, 600)

        self.central = QWidget()
        self.setCentralWidget(self.central)

        self.layout = QVBoxLayout(self.central)
        self.layout.setContentsMargins(0, 0, 0, 0)
        self.layout.setSpacing(0)

        # Header
        header = QLabel("RAZERCTRL")
        header.setStyleSheet("font-size: 18px; font-weight: bold; color: #00FF88; padding: 15px 20px; background-color: #0b0f10; border-bottom: 1px solid #222;")
        self.layout.addWidget(header)

        # Device bar (top)
        self.device_bar = DeviceBar(self.on_device_selected)
        self.layout.addWidget(self.device_bar)

        # Stacked panels container
        panel_container = QWidget()
        panel_layout = QVBoxLayout(panel_container)
        panel_layout.setContentsMargins(20, 20, 20, 20)
        
        self.stack = QStackedWidget()
        panel_layout.addWidget(self.stack)
        self.layout.addWidget(panel_container)

        # Panels
        self.panels = {
            "mouse": MousePanel(),
            "keyboard": KeyboardPanel(),
            "headset": HeadsetPanel(),
        }

        for panel in self.panels.values():
            self.stack.addWidget(panel)

        # Status
        self.status = QLabel("Ready")
        self.status.setStyleSheet("padding: 10px; color: #00FF88; font-size: 12px; border-top: 1px solid #222;")
        self.layout.addWidget(self.status)

        # Initialize OpenRazer
        self.device_manager = RazerDeviceManager()
        self.detect_devices()

        # Default view
        self.load_panel("mouse")

    def detect_devices(self):
        devices = self.device_manager.refresh()
        device_map = self.device_manager.get_devices_by_type()

        self.device_bar.update_devices(device_map)

        self.status.setText(f"{len(devices)} Razer device(s) detected")

    def on_device_selected(self, device_type):
        self.load_panel(device_type)

    def load_panel(self, device_type):
        panel = self.panels.get(device_type)
        if panel:
            self.stack.setCurrentWidget(panel)
