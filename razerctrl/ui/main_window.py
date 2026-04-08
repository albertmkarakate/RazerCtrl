import logging
from PyQt6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QListWidget, QStackedWidget, QPushButton, QLabel, 
                             QStatusBar, QFrame)
from PyQt6.QtCore import Qt, QSize
from PyQt6.QtGui import QIcon

from .dashboard import DashboardPage
from .device_page import DevicePage
from .input_mapper import InputMapperPage
from .profiles import ProfilesPage
from .settings import SettingsPage

class MainWindow(QMainWindow):
    """
    Main application window with sidebar navigation.
    """
    def __init__(self, device_manager, profile_manager, input_manager, macro_manager):
        super().__init__()
        self.device_manager = device_manager
        self.profile_manager = profile_manager
        self.input_manager = input_manager
        self.macro_manager = macro_manager
        
        self.setWindowTitle("RazerCtrl")
        self.setMinimumSize(1000, 700)
        
        self.init_ui()
        self.setup_connections()
        self.refresh_status()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Sidebar
        self.sidebar = QFrame()
        self.sidebar.setFixedWidth(200)
        self.sidebar.setStyleSheet("background-color: #252526; border-right: 1px solid #3c3c3c;")
        sidebar_layout = QVBoxLayout(self.sidebar)
        sidebar_layout.setContentsMargins(10, 20, 10, 20)
        sidebar_layout.setSpacing(5)

        self.nav_buttons = {}
        nav_items = [
            ("Dashboard", "dashboard"),
            ("Devices", "devices"),
            ("Input Mapper", "input_mapper"),
            ("Profiles", "profiles"),
            ("Settings", "settings")
        ]

        for label, key in nav_items:
            btn = QPushButton(label)
            btn.setCheckable(True)
            btn.setFixedHeight(40)
            btn.setStyleSheet("""
                QPushButton {
                    text-align: left;
                    padding-left: 15px;
                    border: none;
                    border-radius: 5px;
                    color: #cccccc;
                    font-size: 14px;
                }
                QPushButton:hover {
                    background-color: #37373d;
                }
                QPushButton:checked {
                    background-color: #094771;
                    color: white;
                    font-weight: bold;
                }
            """)
            btn.clicked.connect(lambda checked, k=key: self.switch_page(k))
            sidebar_layout.addWidget(btn)
            self.nav_buttons[key] = btn

        sidebar_layout.addStretch()
        main_layout.addWidget(self.sidebar)

        # Content Area
        content_container = QWidget()
        content_layout = QVBoxLayout(content_container)
        content_layout.setContentsMargins(0, 0, 0, 0)
        content_layout.setSpacing(0)

        # Top Bar
        self.top_bar = QFrame()
        self.top_bar.setFixedHeight(60)
        self.top_bar.setStyleSheet("background-color: #1e1e1e; border-bottom: 1px solid #3c3c3c;")
        top_bar_layout = QHBoxLayout(self.top_bar)
        
        self.title_label = QLabel("Dashboard")
        self.title_label.setStyleSheet("font-size: 18px; font-weight: bold; color: white;")
        top_bar_layout.addWidget(self.title_label)
        
        top_bar_layout.addStretch()
        
        self.profile_label = QLabel("Profile: Default")
        self.profile_label.setStyleSheet("color: #aaaaaa; margin-right: 10px;")
        top_bar_layout.addWidget(self.profile_label)
        
        self.btn_apply = QPushButton("Apply Profile")
        self.btn_apply.setStyleSheet("""
            QPushButton {
                background-color: #0e639c;
                color: white;
                border: none;
                padding: 5px 15px;
                border-radius: 3px;
            }
            QPushButton:hover {
                background-color: #1177bb;
            }
        """)
        top_bar_layout.addWidget(self.btn_apply)
        
        content_layout.addWidget(self.top_bar)

        # Stacked Widget for pages
        self.stack = QStackedWidget()
        self.pages = {
            "dashboard": DashboardPage(self.device_manager),
            "input_mapper": InputMapperPage(self.input_manager),
            "profiles": ProfilesPage(self.profile_manager),
            "settings": SettingsPage(self.device_manager)
        }
        
        for key, page in self.pages.items():
            self.stack.addWidget(page)
        
        content_layout.addWidget(self.stack)
        main_layout.addWidget(content_container)

        # Status Bar
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.setStyleSheet("background-color: #007acc; color: white;")

        # Initial page
        self.nav_buttons["dashboard"].setChecked(True)
        self.switch_page("dashboard")

    def setup_connections(self):
        """Sets up signals and slots."""
        self.btn_apply.clicked.connect(self.apply_current_profile)

    def switch_page(self, key: str):
        """Switches the visible page in the stacked widget."""
        if key == "devices":
            # If we click devices, we might want to show the first device if available
            if self.device_manager.devices:
                self.show_device_page(self.device_manager.devices[0])
            else:
                self.stack.setCurrentWidget(self.pages["dashboard"])
            return

        if key in self.pages:
            self.stack.setCurrentWidget(self.pages[key])
            self.title_label.setText(key.replace("_", " ").title())
            
            # Update sidebar selection
            for k, btn in self.nav_buttons.items():
                btn.setChecked(k == key)

    def show_device_page(self, device):
        """Shows the configuration page for a specific device."""
        # Check if page already exists
        page_key = f"device_{device.serial}"
        if page_key not in self.pages:
            self.pages[page_key] = DevicePage(device, self.profile_manager, self.input_manager, self.macro_manager)
            self.stack.addWidget(self.pages[page_key])
        
        self.stack.setCurrentWidget(self.pages[page_key])
        self.title_label.setText(device.name)
        
        # Update sidebar
        for btn in self.nav_buttons.values():
            btn.setChecked(False)
        self.nav_buttons["devices"].setChecked(True)

    def apply_current_profile(self):
        """Applies the currently selected profile."""
        if self.profile_manager.current_profile_name:
            self.profile_manager.apply_profile(self.profile_manager.current_profile_name)
            self.status_bar.showMessage(f"Applied profile: {self.profile_manager.current_profile_name}", 3000)

    def refresh_status(self):
        """Updates the status bar information."""
        daemon_status = "Connected" if self.device_manager.is_daemon_running() else "Disconnected"
        device_count = len(self.device_manager.devices)
        self.status_bar.showMessage(f"Daemon: {daemon_status} | Devices: {device_count}")
