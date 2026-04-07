from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QTabWidget, QSlider, QComboBox, QPushButton, 
                             QColorDialog, QFrame, QGroupBox, QFormLayout)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtSvgWidgets import QSvgWidget
import os

class DevicePage(QWidget):
    """
    Configuration page for a specific Razer device.
    """
    def __init__(self, device, parent=None):
        super().__init__(parent)
        self.device = device
        self.init_ui()
        
        # Timer for battery updates
        if hasattr(self.device, 'battery_level'):
            self.timer = QTimer(self)
            self.timer.timeout.connect(self.update_battery)
            self.timer.start(30000) # 30 seconds

    def init_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(30)

        # Left Panel: Device Image
        left_panel = QFrame()
        left_panel.setFixedWidth(350)
        left_layout = QVBoxLayout(left_panel)
        
        self.svg_widget = QSvgWidget()
        svg_path = f"razerctrl/assets/devices/{self.device.type}_generic.svg"
        if not os.path.exists(svg_path):
            svg_path = "razerctrl/assets/devices/mouse_generic.svg"
        self.svg_widget.load(svg_path)
        left_layout.addStretch()
        left_layout.addWidget(self.svg_widget)
        left_layout.addStretch()
        
        layout.addWidget(left_panel)

        # Right Panel: Configuration Tabs
        self.tabs = QTabWidget()
        self.tabs.setStyleSheet("""
            QTabWidget::pane { border: 1px solid #3c3c3c; background-color: #252526; }
            QTabBar::tab { background-color: #2d2d2d; color: #cccccc; padding: 10px 20px; border-right: 1px solid #3c3c3c; }
            QTabBar::tab:selected { background-color: #252526; color: white; border-bottom: 2px solid #0e639c; }
        """)
        
        self.tabs.addTab(self.create_lighting_tab(), "Lighting")
        
        if self.device.type == "mouse":
            self.tabs.addTab(self.create_performance_tab(), "Performance")
            
        if hasattr(self.device, 'battery_level'):
            self.tabs.addTab(self.create_power_tab(), "Power")
            
        self.tabs.addTab(self.create_macro_tab(), "Macros")
        
        layout.addWidget(self.tabs)

    def create_lighting_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        form = QFormLayout()
        
        self.effect_combo = QComboBox()
        self.effect_combo.addItems(["Static", "Breathing", "Spectrum Cycle", "Wave", "Reactive", "Ripple", "Starlight", "None"])
        form.addRow("Effect:", self.effect_combo)
        
        self.btn_color = QPushButton("Pick Color")
        self.btn_color.clicked.connect(self.pick_color)
        form.addRow("Color:", self.btn_color)
        
        self.brightness_slider = QSlider(Qt.Orientation.Horizontal)
        self.brightness_slider.setRange(0, 100)
        self.brightness_slider.setValue(100)
        form.addRow("Brightness:", self.brightness_slider)
        
        self.speed_slider = QSlider(Qt.Orientation.Horizontal)
        self.speed_slider.setRange(1, 10)
        self.speed_slider.setValue(5)
        form.addRow("Speed:", self.speed_slider)
        
        layout.addLayout(form)
        
        btn_apply = QPushButton("Apply Lighting")
        btn_apply.clicked.connect(self.apply_lighting)
        layout.addWidget(btn_apply)
        layout.addStretch()
        
        return tab

    def create_performance_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        form = QFormLayout()
        
        self.dpi_slider = QSlider(Qt.Orientation.Horizontal)
        self.dpi_slider.setRange(100, 16000)
        self.dpi_slider.setSingleStep(100)
        form.addRow("DPI:", self.dpi_slider)
        
        self.polling_combo = QComboBox()
        self.polling_combo.addItems(["125Hz", "500Hz", "1000Hz"])
        form.addRow("Polling Rate:", self.polling_combo)
        
        layout.addLayout(form)
        layout.addStretch()
        return tab

    def create_power_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        self.battery_label = QLabel(f"Current Battery: {self.device.battery_level}%")
        layout.addWidget(self.battery_label)
        
        form = QFormLayout()
        self.sleep_slider = QSlider(Qt.Orientation.Horizontal)
        self.sleep_slider.setRange(1, 15)
        form.addRow("Sleep Timeout (min):", self.sleep_slider)
        
        layout.addLayout(form)
        layout.addStretch()
        return tab

    def create_macro_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        layout.addWidget(QLabel("Macro configuration coming soon..."))
        layout.addStretch()
        return tab

    def pick_color(self):
        color = QColorDialog.getColor()
        if color.isValid():
            self.current_color = (color.red(), color.green(), color.blue())
            self.btn_color.setStyleSheet(f"background-color: {color.name()};")

    def apply_lighting(self):
        effect = self.effect_combo.currentText().lower()
        try:
            if effect == "static":
                self.device.fx.static(*self.current_color)
            elif effect == "none":
                self.device.fx.none()
            # ... other effects
        except Exception as e:
            print(f"Error applying lighting: {e}")

    def update_battery(self):
        if hasattr(self.device, 'battery_level'):
            self.battery_label.setText(f"Current Battery: {self.device.battery_level}%")
