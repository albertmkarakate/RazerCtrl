from PyQt6.QtWidgets import QWidget, QHBoxLayout
from PyQt6.QtCore import Qt
from ui.device_button import DeviceButton
from core.devices import get_device_image_path

class DeviceBar(QWidget):
    def __init__(self, callback):
        super().__init__()
        self.setStyleSheet("background-color: #0b0f10; border-bottom: 1px solid #222;")
        self.setFixedHeight(160)

        self.layout = QHBoxLayout(self)
        self.layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.layout.setSpacing(20)
        
        self.callback = callback
        self.buttons = {}

        device_types = ["mouse", "keyboard", "headset"]

        for d_type in device_types:
            image_path = get_device_image_path(f"Razer {d_type.capitalize()}", d_type)
            btn = DeviceButton(d_type, image_path, self.on_click)
            self.layout.addWidget(btn)
            self.buttons[d_type] = btn

    def update_devices(self, device_map):
        """
        Enable/disable buttons based on detected hardware
        """
        for device_type, btn in self.buttons.items():
            if device_map.get(device_type):
                btn.setEnabled(True)
                btn.set_active(False)
                btn.setStyleSheet("") # Reset any opacity overrides
                btn.update_style()
            else:
                btn.setEnabled(False)
                btn.setStyleSheet("opacity: 0.3; padding: 10px;")

    def on_click(self, device_type):
        for btn in self.buttons.values():
            btn.set_active(False)

        self.buttons[device_type].set_active(True)
        self.callback(device_type)
