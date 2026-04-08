from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QSlider, QHBoxLayout
from PyQt6.QtCore import Qt

class HeadsetPanel(QWidget):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("background-color: #161b22; border: 1px solid #30363d; border-radius: 8px;")

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        title = QLabel("AUDIO SETTINGS")
        title.setStyleSheet("font-size: 14px; font-weight: bold; color: #ffffff; border: none;")
        layout.addWidget(title)
        
        # Volume Section
        vol_container = QWidget()
        vol_container.setStyleSheet("border: none;")
        vol_layout = QVBoxLayout(vol_container)
        
        vol_header = QHBoxLayout()
        vol_label = QLabel("MASTER VOLUME")
        vol_label.setStyleSheet("color: #8b949e; font-size: 10px; font-weight: bold;")
        self.vol_value = QLabel("50%")
        self.vol_value.setStyleSheet("color: #44d62c; font-size: 12px; font-weight: bold;")
        
        vol_header.addWidget(vol_label)
        vol_header.addStretch()
        vol_header.addWidget(self.vol_value)
        
        vol_layout.addLayout(vol_header)

        self.vol_slider = QSlider(Qt.Orientation.Horizontal)
        self.vol_slider.setMinimum(0)
        self.vol_slider.setMaximum(100)
        self.vol_slider.setValue(50)
        self.vol_slider.valueChanged.connect(self.on_vol_change)
        vol_layout.addWidget(self.vol_slider)

        layout.addWidget(vol_container)
        layout.addStretch()

    def on_vol_change(self, value):
        self.vol_value.setText(f"{value}%")
