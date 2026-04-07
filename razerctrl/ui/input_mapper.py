from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QComboBox, QPushButton, QListWidget, QTableWidget, 
                             QTableWidgetItem, QHeaderView, QGroupBox)
from PyQt6.QtCore import Qt

class InputMapperPage(QWidget):
    """
    Page for configuring input remapping rules.
    """
    def __init__(self, input_manager, parent=None):
        super().__init__(parent)
        self.input_manager = input_manager
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Master Toggle
        header = QHBoxLayout()
        header.addWidget(QLabel("Input Mapper"))
        self.btn_enable = QPushButton("Enable Input Mapper")
        self.btn_enable.setCheckable(True)
        header.addStretch()
        header.addWidget(self.btn_enable)
        layout.addLayout(header)

        # Main Panels
        panels = QHBoxLayout()
        
        # Left Panel: Input Devices
        left_panel = QGroupBox("Input Devices")
        left_layout = QVBoxLayout(left_panel)
        
        self.device_combo = QComboBox()
        self.refresh_devices()
        left_layout.addWidget(self.device_combo)
        
        self.btn_listen = QPushButton("Start Listening")
        self.btn_listen.setCheckable(True)
        left_layout.addWidget(self.btn_listen)
        
        self.event_list = QListWidget()
        self.event_list.setStyleSheet("background-color: #1e1e1e; color: #d4d4d4; font-family: monospace;")
        left_layout.addWidget(self.event_list)
        
        panels.addWidget(left_panel, 1)

        # Right Panel: Mapping Rules
        right_panel = QGroupBox("Mapping Rules")
        right_layout = QVBoxLayout(right_panel)
        
        self.rules_table = QTableWidget(0, 4)
        self.rules_table.setHorizontalHeaderLabels(["Trigger", "Action", "Profile", "Enabled"])
        self.rules_table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        right_layout.addWidget(self.rules_table)
        
        self.btn_add_rule = QPushButton("Add Rule")
        right_layout.addWidget(self.btn_add_rule)
        
        panels.addWidget(right_panel, 2)
        
        layout.addLayout(panels)

    def refresh_devices(self):
        self.device_combo.clear()
        devices = self.input_manager.list_devices()
        for dev in devices:
            self.device_combo.addItem(f"{dev['name']} ({dev['path']})", dev['path'])
