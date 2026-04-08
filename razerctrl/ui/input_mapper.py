from PyQt6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QLabel,
    QComboBox,
    QPushButton,
    QGroupBox,
    QLineEdit,
    QMessageBox,
    QTextEdit,
)


class InputMapperPage(QWidget):
    """
    Bridges to the upstream input-remapper workflow.
    """

    def __init__(self, input_manager, parent=None):
        super().__init__(parent)
        self.input_manager = input_manager
        self.init_ui()
        self.refresh_devices()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        title = QLabel("Input Mapper")
        title.setStyleSheet("font-size: 18px; font-weight: bold;")
        layout.addWidget(title)

        help_box = QGroupBox("Recommended workflow")
        help_layout = QVBoxLayout(help_box)
        instructions = QTextEdit()
        instructions.setReadOnly(True)
        instructions.setPlainText(
            "1) Click 'Open Input Remapper UI'.\n"
            "2) Select your device and create a preset.\n"
            "3) Add mappings in the Output box (including macros).\n"
            "4) Press Apply in input-remapper.\n\n"
            "Shortcuts in input-remapper:\n"
            "- Ctrl+R refreshes devices\n"
            "- Ctrl+Del stops injection\n"
            "- Ctrl+Q closes the UI"
        )
        help_layout.addWidget(instructions)
        layout.addWidget(help_box)

        launcher_box = QGroupBox("Input-remapper tools")
        launcher_layout = QHBoxLayout(launcher_box)

        self.btn_open_ui = QPushButton("Open Input Remapper UI")
        self.btn_open_ui.clicked.connect(self.open_input_remapper)
        launcher_layout.addWidget(self.btn_open_ui)

        self.btn_open_debug = QPushButton("Open Debug UI")
        self.btn_open_debug.clicked.connect(lambda: self.open_input_remapper(debug=True))
        launcher_layout.addWidget(self.btn_open_debug)

        self.btn_refresh = QPushButton("Refresh Devices")
        self.btn_refresh.clicked.connect(self.refresh_devices)
        launcher_layout.addWidget(self.btn_refresh)
        layout.addWidget(launcher_box)

        control_box = QGroupBox("Quick Control")
        control_layout = QVBoxLayout(control_box)

        row_1 = QHBoxLayout()
        row_1.addWidget(QLabel("Device:"))
        self.device_combo = QComboBox()
        row_1.addWidget(self.device_combo, 1)
        control_layout.addLayout(row_1)

        row_2 = QHBoxLayout()
        row_2.addWidget(QLabel("Preset:"))
        self.preset_edit = QLineEdit()
        self.preset_edit.setPlaceholderText("Example: gaming")
        row_2.addWidget(self.preset_edit, 1)
        control_layout.addLayout(row_2)

        buttons = QHBoxLayout()
        self.btn_apply = QPushButton("Start Preset")
        self.btn_apply.clicked.connect(self.start_preset)
        buttons.addWidget(self.btn_apply)

        self.btn_stop = QPushButton("Stop Injection")
        self.btn_stop.clicked.connect(self.stop_injection)
        buttons.addWidget(self.btn_stop)

        buttons.addStretch()
        control_layout.addLayout(buttons)
        layout.addWidget(control_box)

        self.status_label = QLabel("")
        layout.addWidget(self.status_label)
        layout.addStretch()

        self.update_availability_state()

    def update_availability_state(self):
        available = self.input_manager.has_input_remapper()
        for widget in (
            self.btn_open_ui,
            self.btn_open_debug,
            self.btn_refresh,
            self.device_combo,
            self.preset_edit,
            self.btn_apply,
            self.btn_stop,
        ):
            widget.setEnabled(available)

        if not available:
            self.status_label.setText(
                "input-remapper is not installed. Install `input-remapper` to enable this page."
            )

    def set_status(self, text: str, ok: bool = True):
        color = "#2ea043" if ok else "#f85149"
        self.status_label.setStyleSheet(f"color: {color};")
        self.status_label.setText(text)

    def refresh_devices(self):
        self.device_combo.clear()
        devices = self.input_manager.list_input_remapper_devices()
        for dev in devices:
            self.device_combo.addItem(dev)
        if devices:
            self.set_status(f"Found {len(devices)} device(s).")
        elif self.input_manager.has_input_remapper():
            self.set_status("No input-remapper devices detected.", ok=False)
        self.update_availability_state()

    def selected_device(self) -> str:
        return self.device_combo.currentText().strip()

    def open_input_remapper(self, debug: bool = False):
        try:
            self.input_manager.open_input_remapper_ui(debug=debug)
            msg = "Opened input-remapper debug UI." if debug else "Opened input-remapper UI."
            self.set_status(msg)
        except Exception as exc:
            self.set_status(f"Failed to open input-remapper UI: {exc}", ok=False)

    def start_preset(self):
        ok, message = self.input_manager.apply_input_remapper_preset(
            self.selected_device(),
            self.preset_edit.text().strip(),
        )
        self.set_status(message, ok=ok)
        if not ok:
            QMessageBox.warning(self, "Input Mapper", message)

    def stop_injection(self):
        ok, message = self.input_manager.stop_input_remapper(self.selected_device())
        self.set_status(message, ok=ok)
        if not ok:
            QMessageBox.warning(self, "Input Mapper", message)
