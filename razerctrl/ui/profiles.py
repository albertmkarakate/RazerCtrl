from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QListWidget, QPushButton, QInputDialog, QMessageBox)
from PyQt6.QtCore import Qt

class ProfilesPage(QWidget):
    """
    Page for managing configuration profiles.
    """
    def __init__(self, profile_manager, parent=None):
        super().__init__(parent)
        self.profile_manager = profile_manager
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        self.profile_list = QListWidget()
        self.refresh_profile_list()
        layout.addWidget(self.profile_list)

        btn_layout = QHBoxLayout()
        self.btn_new = QPushButton("New Profile")
        self.btn_new.clicked.connect(self.create_new_profile)
        
        self.btn_delete = QPushButton("Delete")
        self.btn_delete.clicked.connect(self.delete_profile)
        
        btn_layout.addWidget(self.btn_new)
        btn_layout.addStretch()
        btn_layout.addWidget(self.btn_delete)
        layout.addLayout(btn_layout)

    def refresh_profile_list(self):
        self.profile_list.clear()
        for name in self.profile_manager.profiles.keys():
            self.profile_list.addItem(name)

    def create_new_profile(self):
        name, ok = QInputDialog.getText(self, "New Profile", "Enter profile name:")
        if ok and name:
            self.profile_manager.save_profile(name, {"devices": {}})
            self.refresh_profile_list()

    def delete_profile(self):
        item = self.profile_list.currentItem()
        if item:
            name = item.text()
            reply = QMessageBox.question(self, "Delete Profile", f"Are you sure you want to delete '{name}'?",
                                       QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
            if reply == QMessageBox.StandardButton.Yes:
                # Actual file deletion logic would go here
                del self.profile_manager.profiles[name]
                self.refresh_profile_list()
