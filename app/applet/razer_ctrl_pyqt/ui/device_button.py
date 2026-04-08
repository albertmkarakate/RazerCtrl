from PyQt6.QtWidgets import QLabel, QWidget, QVBoxLayout
from PyQt6.QtGui import QPixmap
from PyQt6.QtCore import Qt

class DeviceButton(QWidget):
    def __init__(self, device_type, image_path, callback):
        super().__init__()
        self.device_type = device_type
        self.callback = callback
        self.is_active = False
        
        self.setFixedSize(128, 128)
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setAttribute(Qt.WidgetAttribute.WA_Hover)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        self.image_label = QLabel()
        if image_path:
            pixmap = QPixmap(image_path).scaled(128, 128, Qt.AspectRatioMode.KeepAspectRatioByExpanding, Qt.TransformationMode.SmoothTransformation)
            self.image_label.setPixmap(pixmap)
        else:
            self.image_label.setText(device_type.upper())
            self.image_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            
        layout.addWidget(self.image_label)
        
        self.name_label = QLabel(device_type.capitalize())
        self.name_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.name_label.setStyleSheet("background-color: rgba(11, 15, 16, 0.8); color: #8b949e; font-size: 10px; font-weight: bold; padding: 4px;")
        
        self.name_label.setParent(self)
        self.name_label.resize(128, 24)
        self.name_label.move(0, 104)

        self.update_style()

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.callback(self.device_type)

    def set_active(self, active: bool):
        self.is_active = active
        self.update_style()
        
    def enterEvent(self, event):
        if not self.is_active:
            self.setStyleSheet("border: 2px solid #30363d; border-radius: 8px; background-color: #13221a; padding: 10px;")
            self.name_label.setStyleSheet("background-color: rgba(19, 34, 26, 0.9); color: #ffffff; font-size: 10px; font-weight: bold; padding: 4px;")
        super().enterEvent(event)
        
    def leaveEvent(self, event):
        self.update_style()
        super().leaveEvent(event)

    def update_style(self):
        if self.is_active:
            self.setStyleSheet("border: 2px solid #00FF88; border-radius: 8px; background-color: #0f1a14; padding: 10px;")
            self.name_label.setStyleSheet("background-color: rgba(0, 255, 136, 0.2); color: #ffffff; font-size: 10px; font-weight: bold; padding: 4px;")
        else:
            self.setStyleSheet("border: 2px solid transparent; border-radius: 8px; background-color: #0b0f10; padding: 10px;")
            self.name_label.setStyleSheet("background-color: rgba(11, 15, 16, 0.8); color: #8b949e; font-size: 10px; font-weight: bold; padding: 4px;")
