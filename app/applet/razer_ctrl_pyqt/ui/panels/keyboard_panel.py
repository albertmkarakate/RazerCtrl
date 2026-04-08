from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel

class KeyboardPanel(QWidget):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("background-color: #161b22; border: 1px solid #30363d; border-radius: 8px;")

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        title = QLabel("KEYBOARD CUSTOMIZATION")
        title.setStyleSheet("font-size: 14px; font-weight: bold; color: #ffffff; border: none;")
        layout.addWidget(title)
        
        desc = QLabel("Select a key on the device map to rebind it.")
        desc.setStyleSheet("color: #8b949e; font-size: 12px; border: none;")
        layout.addWidget(desc)
        
        layout.addStretch()
