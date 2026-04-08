from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QTabWidget, QSlider, QComboBox, QPushButton, 
                             QColorDialog, QFrame, QGroupBox, QFormLayout,
                             QTableWidget, QTableWidgetItem, QHeaderView,
                             QListWidget, QInputDialog, QMessageBox)
from PyQt6.QtCore import Qt, QTimer, pyqtSignal, QObject
from PyQt6.QtSvgWidgets import QSvgWidget
import os

class MacroSignal(QObject):
    """Signal for macro recording updates."""
    event_captured = pyqtSignal(dict)

class DevicePage(QWidget):
    """
    Configuration page for a specific Razer device.
    """
    def __init__(self, device, profile_manager, input_manager, macro_manager, parent=None):
        super().__init__(parent)
        self.device = device
        self.profile_manager = profile_manager
        self.input_manager = input_manager
        self.macro_manager = macro_manager
        self.macro_signals = MacroSignal()
        self.macro_signals.event_captured.connect(self.on_macro_event)
        self.recorded_macro = []
        self.init_ui()
        
        # Timer for battery updates
        try:
            if hasattr(self.device, 'battery_level') and self.device.battery_level is not None:
                self.timer = QTimer(self)
                self.timer.timeout.connect(self.update_battery)
                self.timer.start(30000) # 30 seconds
        except (AttributeError, NotImplementedError):
            pass

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
            
        try:
            if hasattr(self.device, 'battery_level'):
                # Test if it actually works
                _ = self.device.battery_level
                self.tabs.addTab(self.create_power_tab(), "Power")
        except (AttributeError, NotImplementedError):
            pass
            
        self.tabs.addTab(self.create_keybinds_tab(), "Keybinds")
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
        
        try:
            battery = self.device.battery_level
            self.battery_label = QLabel(f"Current Battery: {battery}%")
        except (AttributeError, NotImplementedError):
            self.battery_label = QLabel("Current Battery: Wired / Unknown")
            
        layout.addWidget(self.battery_label)
        
        form = QFormLayout()
        self.sleep_slider = QSlider(Qt.Orientation.Horizontal)
        self.sleep_slider.setRange(1, 15)
        form.addRow("Sleep Timeout (min):", self.sleep_slider)
        
        layout.addLayout(form)
        layout.addStretch()
        return tab

    def create_keybinds_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        header = QHBoxLayout()
        header.addWidget(QLabel("Custom Keybinds"))
        header.addStretch()
        btn_add = QPushButton("Add New Bind")
        btn_add.clicked.connect(self.add_keybind)
        header.addWidget(btn_add)
        layout.addLayout(header)
        
        self.keybinds_table = QTableWidget(0, 3)
        self.keybinds_table.setHorizontalHeaderLabels(["Button", "Action", "Enabled"])
        self.keybinds_table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.keybinds_table.setStyleSheet("background-color: #1e1e1e; color: #d4d4d4;")
        layout.addWidget(self.keybinds_table)
        
        # Placeholder for existing binds
        self.refresh_keybinds()
        
        return tab

    def add_keybind(self):
        # In a real app, this would open a dialog to record a key and select an action
        row = self.keybinds_table.rowCount()
        self.keybinds_table.insertRow(row)
        self.keybinds_table.setItem(row, 0, QTableWidgetItem("New Button"))
        self.keybinds_table.setItem(row, 1, QTableWidgetItem("None"))
        self.keybinds_table.setItem(row, 2, QTableWidgetItem("Yes"))

    def refresh_keybinds(self):
        # This would load binds from the profile manager for this specific device
        pass

    def create_macro_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        header = QHBoxLayout()
        header.addWidget(QLabel("Macro Recorder"))
        header.addStretch()
        
        self.btn_record = QPushButton("Record")
        self.btn_record.clicked.connect(self.toggle_recording)
        self.btn_record.setStyleSheet("background-color: #238636; color: white;")
        header.addWidget(self.btn_record)
        
        self.btn_clear = QPushButton("Clear")
        self.btn_clear.clicked.connect(self.clear_macro)
        header.addWidget(self.btn_clear)
        
        layout.addLayout(header)
        
        self.macro_list = QListWidget()
        self.macro_list.setStyleSheet("background-color: #1e1e1e; color: #d4d4d4; font-family: monospace;")
        layout.addWidget(self.macro_list)
        
        footer = QHBoxLayout()
        self.btn_save_macro = QPushButton("Save Macro")
        self.btn_save_macro.clicked.connect(self.save_macro)
        self.btn_save_macro.setEnabled(False)
        footer.addWidget(self.btn_save_macro)
        
        layout.addLayout(footer)
        return tab

    def toggle_recording(self):
        if self.btn_record.text() == "Record":
            # Start recording
            # We need to find the evdev path for this device
            # For now, we'll ask the user to select or use a heuristic
            devices = self.input_manager.list_devices()
            # Heuristic: find device with name containing Razer and device.name
            target_path = None
            for dev in devices:
                if self.device.name.lower() in dev['name'].lower():
                    target_path = dev['path']
                    break
            
            if not target_path:
                # Fallback: show selection dialog
                items = [f"{d['name']} ({d['path']})" for d in devices]
                item, ok = QInputDialog.getItem(self, "Select Input Device", 
                                              "Could not auto-detect input device. Select one:", 
                                              items, 0, False)
                if ok and item:
                    target_path = devices[items.index(item)]['path']
            
            if target_path:
                self.recorded_macro = []
                self.macro_list.clear()
                self.input_manager.start_recording(target_path, self.macro_signals.event_captured.emit)
                self.btn_record.setText("Stop")
                self.btn_record.setStyleSheet("background-color: #da3633; color: white;")
                self.btn_save_macro.setEnabled(False)
        else:
            # Stop recording
            self.input_manager.stop_recording()
            self.btn_record.setText("Record")
            self.btn_record.setStyleSheet("background-color: #238636; color: white;")
            if self.recorded_macro:
                self.btn_save_macro.setEnabled(True)

    def on_macro_event(self, event):
        self.recorded_macro.append(event)
        action = "Down" if event['value'] == 1 else ("Up" if event['value'] == 0 else "Hold")
        self.macro_list.addItem(f"[{event['delay']}ms] {event['key']} {action}")
        self.macro_list.scrollToBottom()

    def clear_macro(self):
        self.recorded_macro = []
        self.macro_list.clear()
        self.btn_save_macro.setEnabled(False)

    def save_macro(self):
        name, ok = QInputDialog.getText(self, "Save Macro", "Enter macro name:")
        if ok and name:
            self.macro_manager.add_macro(name, self.recorded_macro)
            QMessageBox.information(self, "Success", f"Macro '{name}' saved successfully.")

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
        try:
            if hasattr(self.device, 'battery_level'):
                self.battery_label.setText(f"Current Battery: {self.device.battery_level}%")
        except (AttributeError, NotImplementedError):
            if hasattr(self, 'timer'):
                self.timer.stop()
            if hasattr(self, 'battery_label'):
                self.battery_label.setText("Current Battery: Wired")
