"""Shared fixtures for RazerCtrl tests."""
import json
import os
import sys
import tempfile
from pathlib import Path
from unittest.mock import MagicMock

import pytest

# ---------------------------------------------------------------------------
# Mock heavy external dependencies before any razerctrl module is imported.
# These modules are not available in CI (openrazer, evdev, PyQt6).
# ---------------------------------------------------------------------------

_mock_openrazer_client = MagicMock()
DaemonNotRunningError = type("DaemonNotRunningError", (Exception,), {})
_mock_openrazer_client.DaemonNotRunningError = DaemonNotRunningError
_mock_openrazer_client.DeviceManager = MagicMock()

sys.modules.setdefault("openrazer", MagicMock())
sys.modules.setdefault("openrazer.client", _mock_openrazer_client)
sys.modules.setdefault("evdev", MagicMock())
sys.modules.setdefault("PyQt6", MagicMock())
sys.modules.setdefault("PyQt6.QtGui", MagicMock())
sys.modules.setdefault("PyQt6.QtWidgets", MagicMock())
sys.modules.setdefault("PyQt6.QtCore", MagicMock())


@pytest.fixture
def tmp_config_dir(tmp_path):
    """Provides a temporary config directory tree."""
    config_dir = tmp_path / ".config" / "razerctrl"
    profiles_dir = config_dir / "profiles"
    config_dir.mkdir(parents=True)
    profiles_dir.mkdir(parents=True)
    return config_dir


@pytest.fixture
def mock_device():
    """Creates a mock Razer device with common attributes."""
    device = MagicMock()
    device.serial = "XX000000"
    device.name = "Razer DeathAdder V2"
    device.vendor_id = 0x1532
    device.product_id = 0x0084
    device.dpi = (800, 800)
    device.poll_rate = 1000
    device.max_dpi = 20000
    device.battery_level = 85

    # Lighting effects
    device.fx = MagicMock()
    device.fx.static = MagicMock()
    device.fx.spectrum = MagicMock()
    device.fx.wave = MagicMock()
    device.fx.reactive = MagicMock()
    device.fx.breath_single = MagicMock()
    device.fx.none = MagicMock()
    device.fx.advanced = MagicMock()

    return device


@pytest.fixture
def sample_profile_data():
    """Sample profile data for testing."""
    return {
        "name": "Gaming",
        "devices": {
            "XX000000": {
                "lighting": {"effect": "static", "color": [0, 255, 65]},
                "performance": {"dpi": (1600, 1600)},
            }
        },
    }


@pytest.fixture
def sample_macro_events():
    """Sample macro event list for testing."""
    return [
        {"key": "KEY_A", "value": 1, "delay": 0},
        {"key": "KEY_A", "value": 0, "delay": 50},
        {"key": "KEY_B", "value": 1, "delay": 100},
        {"key": "KEY_B", "value": 0, "delay": 50},
    ]
