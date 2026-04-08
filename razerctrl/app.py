import sys
import logging
import os
from PyQt6.QtWidgets import QApplication
from PyQt6.QtGui import QIcon
from .ui.main_window import MainWindow
from .ui.dependency_check import DependencyCheckDialog
from .core.device_manager import DeviceManager
from .core.profile_manager import ProfileManager
from .core.input_manager import InputManager
from .core.macro_manager import MacroManager
from .core.config import setup_logging, load_config

class RazerCtrlApp(QApplication):
    """
    Main application class for RazerCtrl.
    """
    def __init__(self, argv):
        super().__init__(argv)
        self.setApplicationName("RazerCtrl")
        self.setApplicationVersion("0.1.0")
        self.setOrganizationName("RazerCtrl")
        
        # Set application icon
        icon_path = os.path.join(os.path.dirname(__file__), "assets", "icons", "razerctrl.svg")
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
        
        # Set desktop file name for taskbar grouping (Linux)
        self.setDesktopFileName("razerctrl.desktop")
        
        # Setup logging
        setup_logging()
        logging.info("Starting RazerCtrl...")

        # Initialize core managers
        self.device_manager = DeviceManager()
        self.profile_manager = ProfileManager(self.device_manager)
        self.input_manager = InputManager()
        self.macro_manager = MacroManager()
        
        # Load configuration
        self.config = load_config()

        # Check dependencies on first run
        if not self.config.get("dependencies_checked", False):
            self.show_dependency_check()

        # Create main window
        self.main_window = MainWindow(
            self.device_manager,
            self.profile_manager,
            self.input_manager,
            self.macro_manager
        )

    def show_dependency_check(self):
        """Shows the dependency check dialog."""
        dialog = DependencyCheckDialog()
        if dialog.exec():
            # Update config to mark dependencies as checked
            self.config["dependencies_checked"] = True
            from .core.config import save_config
            save_config(self.config)

    def run(self):
        """Starts the application."""
        self.main_window.show()
        return self.exec()
