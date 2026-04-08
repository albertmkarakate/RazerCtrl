from PyQt6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QLabel,
    QPushButton,
    QGroupBox,
    QFormLayout,
    QCheckBox,
    QComboBox,
    QHBoxLayout,
)
from PyQt6.QtCore import pyqtSignal

from ..core.config import save_config

class SettingsPage(QWidget):
    """
    Application settings page.
    """
    theme_changed = pyqtSignal(str)

    def __init__(self, device_manager, config: dict, parent=None):
        super().__init__(parent)
        self.device_manager = device_manager
        self.config = config
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Daemon Section
        daemon_group = QGroupBox("OpenRazer Daemon")
        daemon_layout = QVBoxLayout(daemon_group)
        
        self.status_label = QLabel("Status: Checking...")
        daemon_layout.addWidget(self.status_label)
        
        btn_layout = QHBoxLayout()
        self.btn_restart = QPushButton("Restart Daemon")
        btn_layout.addWidget(self.btn_restart)
        daemon_layout.addLayout(btn_layout)
        
        layout.addWidget(daemon_group)

        # App Settings
        app_group = QGroupBox("Application Settings")
        app_form = QFormLayout(app_group)
        
        self.check_startup = QCheckBox("Start RazerCtrl on login")
        app_form.addRow(self.check_startup)
        
        self.theme_combo = QComboBox()
        self.theme_combo.addItems(["System", "Dark", "Light"])
        saved_theme = str(self.config.get("theme", "System")).capitalize()
        if saved_theme in ("System", "Dark", "Light"):
            self.theme_combo.setCurrentText(saved_theme)
        app_form.addRow("Theme:", self.theme_combo)
        
        self.check_tray = QCheckBox("Minimize to tray")
        app_form.addRow(self.check_tray)
        
        layout.addWidget(app_group)

        # About Section
        about_group = QGroupBox("About")
        about_layout = QVBoxLayout(about_group)
        about_layout.addWidget(QLabel("RazerCtrl v0.1.0"))
        about_layout.addWidget(QLabel("A unified Razer device manager for Linux."))
        about_layout.addWidget(QLabel("Licensed under MIT License."))
        layout.addWidget(about_group)

        layout.addStretch()
        self.update_daemon_status()
        self.theme_combo.currentTextChanged.connect(self.on_theme_changed)

    def update_daemon_status(self):
        status = "Connected" if self.device_manager.is_daemon_running() else "Disconnected"
        self.status_label.setText(f"Status: {status}")

    def on_theme_changed(self, value: str):
        self.config["theme"] = value.lower()
        save_config(self.config)
        self.theme_changed.emit(value.lower())
