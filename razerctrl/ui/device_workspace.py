import os
from dataclasses import dataclass
from typing import Dict, List, Optional

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QIcon
from PyQt6.QtWidgets import (
    QFrame,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QStackedWidget,
    QVBoxLayout,
    QWidget,
)


@dataclass
class DeviceContext:
    """Lightweight context used by the UI routing layer."""

    key: str
    label: str
    icon_path: str
    device: Optional[object] = None


class DeviceWorkspacePage(QWidget):
    """Device-first workspace with top icon bar and stacked config panels."""

    device_selected = pyqtSignal(object)

    def __init__(self, device_manager, parent=None):
        super().__init__(parent)
        self.device_manager = device_manager
        self.device_contexts: List[DeviceContext] = []
        self.icon_buttons: Dict[str, QPushButton] = {}
        self.panels: Dict[str, QWidget] = {}
        self.active_key: Optional[str] = None
        self.init_ui()
        self.refresh_devices()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 12, 20, 12)
        layout.setSpacing(12)

        # Top device bar
        self.device_bar = QFrame()
        self.device_bar.setObjectName("deviceBar")
        self.device_bar.setStyleSheet(
            "QFrame#deviceBar { background-color: #1f1f1f; border: 1px solid #3c3c3c; border-radius: 8px; }"
        )
        bar_layout = QHBoxLayout(self.device_bar)
        bar_layout.setContentsMargins(10, 8, 10, 8)
        bar_layout.setSpacing(8)
        self.device_bar_layout = bar_layout
        layout.addWidget(self.device_bar)

        # Main panel stack
        self.stack = QStackedWidget()
        self.stack.setStyleSheet(
            "QStackedWidget { background-color: #252526; border: 1px solid #3c3c3c; border-radius: 8px; }"
        )
        layout.addWidget(self.stack, stretch=1)

        # Status strip
        self.status_strip = QLabel("Status: waiting for device detection...")
        self.status_strip.setStyleSheet(
            "background-color: #1f1f1f; color: #d0d0d0; border: 1px solid #3c3c3c; border-radius: 6px; padding: 8px;"
        )
        layout.addWidget(self.status_strip)

    def refresh_devices(self):
        self.device_manager.refresh_devices()
        self.device_contexts = self._build_contexts(self.device_manager.devices)

        self._clear_device_bar()
        self._clear_stack()

        if not self.device_contexts:
            placeholder = self._build_placeholder_panel(
                title="No supported Razer devices detected",
                description="Connect a device and refresh detection from Dashboard.",
            )
            self.panels["none"] = placeholder
            self.stack.addWidget(placeholder)
            self.stack.setCurrentWidget(placeholder)
            self.status_strip.setText("Status: Device disconnected | Profile inactive | Logs ready")
            return

        for ctx in self.device_contexts:
            button = self._make_icon_button(ctx)
            self.icon_buttons[ctx.key] = button
            self.device_bar_layout.addWidget(button)

            panel = self._build_device_panel(ctx)
            self.panels[ctx.key] = panel
            self.stack.addWidget(panel)

        self.device_bar_layout.addStretch(1)
        self.load_panel(self.device_contexts[0].key)

    def load_panel(self, device_key: str):
        """Deterministic panel switch routing function."""
        panel = self.panels.get(device_key)
        if panel is None:
            return

        self.stack.setCurrentWidget(panel)
        self.active_key = device_key

        for key, button in self.icon_buttons.items():
            button.setChecked(key == device_key)

        context = next((ctx for ctx in self.device_contexts if ctx.key == device_key), None)
        if context and context.device is not None:
            self.device_selected.emit(context.device)
            self.status_strip.setText(
                f"Status: Device Connected ({context.label}) | Profile Active | Logs ready"
            )
        else:
            self.status_strip.setText(
                f"Status: Available panel ({device_key}) | Profile Active | Logs ready"
            )

    def handle_mouse_click(self):
        """Example workflow route for architecture docs."""
        self.load_panel("mouse")

    def _build_contexts(self, devices) -> List[DeviceContext]:
        base = os.path.dirname(os.path.dirname(__file__))
        icon_dir = os.path.join(base, "assets", "devices")

        type_map = {
            "mouse": "mouse",
            "keyboard": "keyboard",
            "headset": "headset",
            "keypad": "keypad",
            "mousepad": "mousepad",
            "mousemat": "mousemat",
            "accessory": "accessory",
            "controller": "controller",
        }

        contexts: List[DeviceContext] = []
        seen = set()
        for dev in devices:
            dtype = type_map.get(getattr(dev, "type", ""), "accessory")
            if dtype in seen:
                continue
            seen.add(dtype)
            contexts.append(
                DeviceContext(
                    key=dtype,
                    label=getattr(dev, "name", dtype.title()),
                    icon_path=os.path.join(icon_dir, f"{dtype}_generic.svg"),
                    device=dev,
                )
            )

        return contexts

    def _make_icon_button(self, ctx: DeviceContext) -> QPushButton:
        btn = QPushButton()
        btn.setObjectName(f"btn_{ctx.key}")
        btn.setToolTip(ctx.label)
        btn.setFixedSize(48, 48)
        btn.setCheckable(True)
        btn.setCursor(Qt.CursorShape.PointingHandCursor)
        btn.setIcon(QIcon(ctx.icon_path))
        btn.setIconSize(btn.size() * 0.66)
        btn.clicked.connect(lambda checked, key=ctx.key: self.load_panel(key))
        btn.setStyleSheet(
            """
            QPushButton {
                border: 1px solid #3c3c3c;
                border-radius: 10px;
                background-color: #2b2b2b;
            }
            QPushButton:hover {
                background-color: #343434;
                border: 1px solid #0e639c;
            }
            QPushButton:checked {
                background-color: #0e639c;
                border: 1px solid #2da2ef;
            }
            """
        )
        return btn

    def _build_device_panel(self, ctx: DeviceContext) -> QWidget:
        panel = QWidget()
        panel_layout = QVBoxLayout(panel)
        panel_layout.setContentsMargins(24, 24, 24, 24)
        panel_layout.setSpacing(10)

        title = QLabel(ctx.label)
        title.setStyleSheet("font-size: 22px; font-weight: 700; color: #ffffff;")
        panel_layout.addWidget(title)

        subtitle = QLabel(
            "Dynamic configuration panel (skeleton): wire handlers to OpenRazer service functions."
        )
        subtitle.setWordWrap(True)
        subtitle.setStyleSheet("font-size: 13px; color: #b0b0b0;")
        panel_layout.addWidget(subtitle)

        example = QLabel(self._example_for(ctx.key))
        example.setStyleSheet(
            "font-family: monospace; font-size: 12px; color: #80c8ff; background-color: #1d1d1d; border-radius: 4px; padding: 10px;"
        )
        example.setWordWrap(True)
        panel_layout.addWidget(example)

        panel_layout.addStretch(1)
        return panel

    def _build_placeholder_panel(self, title: str, description: str) -> QWidget:
        panel = QWidget()
        layout = QVBoxLayout(panel)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        title_label = QLabel(title)
        title_label.setStyleSheet("font-size: 22px; font-weight: 700; color: #fff;")
        layout.addWidget(title_label)

        desc = QLabel(description)
        desc.setStyleSheet("font-size: 13px; color: #aaa;")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(desc)
        return panel

    def _clear_device_bar(self):
        self.icon_buttons.clear()
        while self.device_bar_layout.count():
            item = self.device_bar_layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()

    def _clear_stack(self):
        self.panels.clear()
        while self.stack.count() > 0:
            widget = self.stack.widget(0)
            self.stack.removeWidget(widget)
            widget.deleteLater()

    @staticmethod
    def _example_for(device_key: str) -> str:
        examples = {
            "mouse": "handle_dpi_change(value) -> set_mouse_dpi(value) -> OpenRazer API",
            "keyboard": "handle_lighting_change(effect) -> set_keyboard_effect(effect) -> OpenRazer API",
            "headset": "handle_audio_toggle(value) -> set_headset_mode(value) -> service layer",
        }
        return examples.get(device_key, "handle_action(payload) -> controller -> service -> OpenRazer")
