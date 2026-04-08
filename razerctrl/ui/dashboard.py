from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QGridLayout, QLabel, 
                             QFrame, QHBoxLayout, QPushButton, QScrollArea)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtSvgWidgets import QSvgWidget
import os

from .device_assets import resolve_device_svg_path

class DeviceCard(QFrame):
    """
    A card representing a single Razer device on the dashboard.
    """
    clicked = pyqtSignal(object)

    def __init__(self, device, parent=None):
        super().__init__(parent)
        self.device = device
        self.setFixedSize(300, 200)
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setStyleSheet("""
            QFrame {
                background-color: #2d2d2d;
                border: 1px solid #3c3c3c;
                border-radius: 10px;
            }
            QFrame:hover {
                background-color: #37373d;
                border: 1px solid #0e639c;
            }
        """)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(15, 15, 15, 15)

        # Header
        header = QHBoxLayout()
        name_label = QLabel(self.device.name)
        name_label.setStyleSheet("font-weight: bold; font-size: 14px; color: white;")
        header.addWidget(name_label)
        
        type_badge = QLabel(self.device.type.capitalize())
        type_badge.setStyleSheet("""
            background-color: #0e639c;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        """)
        header.addWidget(type_badge)
        header.addStretch()
        layout.addLayout(header)

        # Body (SVG)
        body = QHBoxLayout()
        self.svg_widget = QSvgWidget()
        self.svg_widget.setFixedSize(100, 100)
        # Prefer generated line-drawn per-device SVG, then fallback to generic by type
        base_path = os.path.dirname(os.path.dirname(__file__))
        svg_path = resolve_device_svg_path(self.device, base_path)
        self.svg_widget.load(svg_path)
        body.addStretch()
        body.addWidget(self.svg_widget)
        body.addStretch()
        layout.addLayout(body)

        # Footer
        footer = QHBoxLayout()
        try:
            battery = self.device.battery_level
            battery_label = QLabel(f"Battery: {battery}%")
        except (AttributeError, NotImplementedError):
            battery_label = QLabel("Wired")
        battery_label.setStyleSheet("color: #aaaaaa; font-size: 11px;")
        footer.addWidget(battery_label)
        
        footer.addStretch()
        
        try:
            if hasattr(self.device, 'fx') and hasattr(self.device.fx, 'get_effect_name'):
                effect_name = self.device.fx.get_effect_name()
                effect_label = QLabel(f"Effect: {effect_name}")
            else:
                effect_label = QLabel("Effect: N/A")
        except (AttributeError, NotImplementedError):
            effect_label = QLabel("Effect: N/A")
            
        effect_label.setStyleSheet("color: #aaaaaa; font-size: 11px;")
        footer.addWidget(effect_label)
        layout.addLayout(footer)

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.clicked.emit(self.device)

class DashboardPage(QWidget):
    """
    Dashboard page showing an overview of all connected devices.
    """
    device_selected = pyqtSignal(object)

    def __init__(self, device_manager, parent=None):
        super().__init__(parent)
        self.device_manager = device_manager
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        # Scroll Area for cards
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll.setStyleSheet("background-color: transparent;")
        
        self.scroll_content = QWidget()
        self.grid = QGridLayout(self.scroll_content)
        self.grid.setSpacing(20)
        self.grid.setAlignment(Qt.AlignmentFlag.AlignTop | Qt.AlignmentFlag.AlignLeft)
        
        scroll.setWidget(self.scroll_content)
        layout.addWidget(scroll)

        self.refresh_devices()

    def refresh_devices(self):
        """Clears and re-populates the device grid."""
        # Clear grid
        for i in reversed(range(self.grid.count())):
            self.grid.itemAt(i).widget().setParent(None)

        devices = self.device_manager.devices
        if not devices:
            no_device_label = QLabel("No Razer devices found.")
            no_device_label.setStyleSheet("font-size: 16px; color: #aaaaaa;")
            no_device_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            self.grid.addWidget(no_device_label, 0, 0)
            
            check_daemon_btn = QPushButton("Check openrazer-daemon")
            check_daemon_btn.setFixedWidth(200)
            check_daemon_btn.clicked.connect(self.device_manager.initialize)
            self.grid.addWidget(check_daemon_btn, 1, 0, Qt.AlignmentFlag.AlignCenter)
            return

        for i, device in enumerate(devices):
            card = DeviceCard(device)
            card.clicked.connect(self.device_selected.emit)
            self.grid.addWidget(card, i // 2, i % 2)
