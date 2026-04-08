import sys
import subprocess
import logging
from PyQt6.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QPlainTextEdit, QCheckBox, QWidget)
from PyQt6.QtCore import Qt, QThread, pyqtSignal
from ..utils.distro_detect import get_distro_family

class InstallThread(QThread):
    """
    Background thread for running installation commands.
    """
    output_signal = pyqtSignal(str)
    finished_signal = pyqtSignal(bool)

    def __init__(self, command: str):
        super().__init__()
        self.command = command

    def run(self):
        try:
            process = subprocess.Popen(
                self.command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            for line in process.stdout:
                self.output_signal.emit(line)
            
            process.wait()
            self.finished_signal.emit(process.returncode == 0)
        except Exception as e:
            self.output_signal.emit(f"Error: {e}\n")
            self.finished_signal.emit(False)

class DependencyCheckDialog(QDialog):
    """
    Dialog that checks for and helps install system dependencies.
    """
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("RazerCtrl - Dependency Check")
        self.setMinimumSize(500, 400)
        self.distro = get_distro_family()
        self.init_ui()
        self.check_dependencies()

    def init_ui(self):
        layout = QVBoxLayout(self)

        self.label = QLabel("Checking system dependencies...")
        self.label.setStyleSheet("font-weight: bold; font-size: 14px;")
        layout.addWidget(self.label)

        self.deps_layout = QVBoxLayout()
        layout.addLayout(self.deps_layout)

        self.deps = {
            "openrazer-daemon": {"name": "OpenRazer Daemon", "status": False},
            "python-openrazer": {"name": "OpenRazer Python Client", "status": False},
            "python-evdev": {"name": "evdev (Python)", "status": False},
            "python-uinput": {"name": "uinput (Python)", "status": False}
        }

        self.dep_widgets = {}
        for key, dep in self.deps.items():
            row = QHBoxLayout()
            label = QLabel(dep["name"])
            status_label = QLabel("Checking...")
            row.addWidget(label)
            row.addStretch()
            row.addWidget(status_label)
            self.dep_widgets[key] = status_label
            self.deps_layout.addLayout(row)

        self.output_view = QPlainTextEdit()
        self.output_view.setReadOnly(True)
        self.output_view.setStyleSheet("background-color: #1e1e1e; color: #d4d4d4; font-family: monospace;")
        layout.addWidget(self.output_view)

        self.btn_layout = QHBoxLayout()
        self.btn_install = QPushButton("Install Missing")
        self.btn_install.clicked.connect(self.install_missing)
        self.btn_check = QPushButton("Check Again")
        self.btn_check.clicked.connect(self.check_dependencies)
        self.btn_close = QPushButton("Close")
        self.btn_close.clicked.connect(self.accept)
        
        self.btn_layout.addWidget(self.btn_install)
        self.btn_layout.addWidget(self.btn_check)
        self.btn_layout.addStretch()
        self.btn_layout.addWidget(self.btn_close)
        layout.addLayout(self.btn_layout)

    def check_dependencies(self):
        """Checks if dependencies are installed."""
        # Check openrazer-daemon
        try:
            subprocess.run(["systemctl", "status", "openrazer-daemon"], capture_output=True)
            self.deps["openrazer-daemon"]["status"] = True
        except:
            self.deps["openrazer-daemon"]["status"] = False

        # Check python modules
        for key in ["python-openrazer", "python-evdev", "python-uinput"]:
            module_name = key.replace("python-", "").replace("-", ".")
            if key == "python-openrazer": module_name = "openrazer.client"
            try:
                __import__(module_name)
                self.deps[key]["status"] = True
            except ImportError:
                self.deps[key]["status"] = False

        # Update UI
        all_satisfied = True
        for key, dep in self.deps.items():
            widget = self.dep_widgets[key]
            if dep["status"]:
                widget.setText("✓")
                widget.setStyleSheet("color: green; font-weight: bold;")
            else:
                widget.setText("✗")
                widget.setStyleSheet("color: red; font-weight: bold;")
                all_satisfied = False
        
        if all_satisfied:
            self.label.setText("All dependencies satisfied.")
            self.btn_install.setEnabled(False)
        else:
            self.label.setText("Some dependencies are missing.")
            self.btn_install.setEnabled(True)

    def install_missing(self):
        """Runs the installation command for the detected distro."""
        cmd = ""
        if self.distro == 'arch':
            cmd = "sudo pacman -S --needed python-pyqt6 python-evdev openrazer-daemon"
        elif self.distro == 'fedora':
            cmd = "sudo dnf install -y python3-qt6 python3-evdev openrazer-daemon python3-openrazer"
        elif self.distro == 'debian':
            cmd = "sudo apt update && sudo apt install -y python3-pyqt6 python3-evdev openrazer-meta python3-openrazer"
        
        if not cmd:
            self.output_view.appendPlainText("Distro not supported for auto-install. Please install manually.")
            return

        self.output_view.appendPlainText(f"Running: {cmd}\n")
        self.btn_install.setEnabled(False)
        self.btn_check.setEnabled(False)
        
        self.thread = InstallThread(cmd)
        self.thread.output_signal.connect(self.output_view.appendPlainText)
        self.thread.finished_signal.connect(self.on_install_finished)
        self.thread.start()

    def on_install_finished(self, success: bool):
        self.btn_check.setEnabled(True)
        if success:
            self.output_view.appendPlainText("\nInstallation finished successfully. Please check again.")
        else:
            self.output_view.appendPlainText("\nInstallation failed. See output above.")
