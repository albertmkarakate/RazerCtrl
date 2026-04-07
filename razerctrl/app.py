import sys
import logging
from PyQt6.QtWidgets import QApplication
from .ui.main_window import MainWindow
from .ui.dependency_check import DependencyCheckDialog
from .core.device_manager import DeviceManager
from .core.profile_manager import ProfileManager
from .core.input_manager import InputManager
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
        
        # Setup logging
        setup_logging()
        logging.info("Starting RazerCtrl...")

        # Initialize core managers
        self.device_manager = DeviceManager()
        self.profile_manager = ProfileManager(self.device_manager)
        self.input_manager = InputManager()
        
        # Load configuration
        self.config = load_config()

        # Check dependencies on first run
        if not self.config.get("dependencies_checked", False):
            self.show_dependency_check()

        # Create main window
        self.main_window = MainWindow(
            self.device_manager,
            self.profile_manager,
            self.input_manager
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
