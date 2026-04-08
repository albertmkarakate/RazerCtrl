from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QSlider, QHBoxLayout
from PyQt6.QtCore import Qt
from core.devices import RazerDeviceManager

class MousePanel(QWidget):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("background-color: #0b0f10; border: 1px solid #222; border-radius: 8px;")
        self.device_manager = RazerDeviceManager()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        title = QLabel("MOUSE PERFORMANCE")
        title.setStyleSheet("font-size: 16px; font-weight: bold; color: #ffffff; border: none;")
        layout.addWidget(title)

        # DPI Section
        dpi_container = QWidget()
        dpi_container.setStyleSheet("border: none;")
        dpi_layout = QVBoxLayout(dpi_container)
        
        dpi_header = QHBoxLayout()
        dpi_label = QLabel("SENSITIVITY (DPI)")
        dpi_label.setStyleSheet("color: #00FF88; font-size: 12px; font-weight: bold;")
        self.dpi_value = QLabel("800")
        self.dpi_value.setStyleSheet("color: #ffffff; font-size: 14px; font-weight: bold;")
        
        dpi_header.addWidget(dpi_label)
        dpi_header.addStretch()
        dpi_header.addWidget(self.dpi_value)
        
        dpi_layout.addLayout(dpi_header)

        self.dpi_slider = QSlider(Qt.Orientation.Horizontal)
        self.dpi_slider.setMinimum(400)
        self.dpi_slider.setMaximum(16000)
        self.dpi_slider.setSingleStep(100)
        self.dpi_slider.setValue(800)
        self.dpi_slider.valueChanged.connect(self.set_dpi)
        dpi_layout.addWidget(self.dpi_slider)

        layout.addWidget(dpi_container)
        layout.addStretch()

    def set_dpi(self, value):
        # Snap to nearest 100
        snapped = round(value / 100) * 100
        self.dpi_value.setText(str(snapped))
        
        devices = self.device_manager.refresh()
        for device in devices:
            if "mouse" in device.name.lower() and hasattr(device, "dpi"):
                try:
                    device.dpi = (snapped, snapped)
                    print(f"DPI set to {snapped} on {device.name}")
                except Exception as e:
                    print(f"Failed to set DPI on {device.name}: {e}")
