"""Tests for razerctrl.backend.openrazer_service."""
import sys
from unittest.mock import MagicMock, patch, PropertyMock

import pytest

from tests.conftest import DaemonNotRunningError
from razerctrl.backend.openrazer_service import OpenRazerService


@pytest.fixture
def service_with_device(mock_device):
    """Creates an OpenRazerService with a mock manager containing one device."""
    svc = OpenRazerService.__new__(OpenRazerService)
    svc.manager = MagicMock()
    svc.manager.devices = [mock_device]
    return svc


@pytest.fixture
def service_no_daemon():
    """Creates an OpenRazerService with no daemon connection."""
    svc = OpenRazerService.__new__(OpenRazerService)
    svc.manager = None
    return svc


class TestCheckDaemon:
    """Tests for daemon connectivity check."""

    def test_daemon_running(self, service_with_device):
        assert service_with_device.check_daemon() is True

    def test_daemon_not_running(self, service_no_daemon):
        with patch("razerctrl.backend.openrazer_service.DeviceManager", side_effect=DaemonNotRunningError):
            assert service_no_daemon.check_daemon() is False


class TestGetDevices:
    """Tests for device listing."""

    def test_returns_device_list(self, service_with_device):
        devices = service_with_device.get_devices()
        assert len(devices) == 1
        assert devices[0]["id"] == "XX000000"
        assert devices[0]["name"] == "Razer DeathAdder V2"

    def test_device_capabilities(self, service_with_device):
        devices = service_with_device.get_devices()
        caps = devices[0]["capabilities"]
        assert caps["has_lighting"] is True
        assert caps["has_dpi"] is True
        assert caps["has_poll_rate"] is True

    def test_raises_when_daemon_down(self, service_no_daemon):
        with patch("razerctrl.backend.openrazer_service.DeviceManager", side_effect=DaemonNotRunningError):
            with pytest.raises(RuntimeError, match="daemon not running"):
                service_no_daemon.get_devices()

    def test_empty_device_list(self):
        svc = OpenRazerService.__new__(OpenRazerService)
        svc.manager = MagicMock()
        svc.manager.devices = []
        assert svc.get_devices() == []


class _FakeDevice:
    """Simple stand-in for a Razer device with a real ``name`` attribute.

    MagicMock intercepts ``__contains__`` on ``name`` which breaks the
    ``"mouse" in name`` check used by ``_get_type``.
    """
    def __init__(self, name: str):
        self.name = name


class TestGetType:
    """Tests for device type detection."""

    def test_mouse(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer DeathAdder V2 Mouse")) == "mouse"

    def test_keyboard(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer BlackWidow V3 Keyboard")) == "keyboard"

    def test_headset(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer Kraken Headset")) == "headset"

    def test_keypad(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer Tartarus Keypad")) == "keypad"

    def test_gamepad_controller(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer Raiju Controller")) == "gamepad"

    def test_gamepad_raiju(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer Raiju")) == "gamepad"

    def test_other(self, service_with_device):
        assert service_with_device._get_type(_FakeDevice("Razer Chroma Mug")) == "other"


class TestGetDeviceState:
    """Tests for device state retrieval."""

    def test_existing_device(self, service_with_device):
        state = service_with_device.get_device_state("XX000000")
        assert state is not None
        assert state["serial"] == "XX000000"
        assert state["name"] == "Razer DeathAdder V2"
        assert state["battery"] == 85
        assert "dpi" in state
        assert "poll_rate" in state

    def test_nonexistent_device(self, service_with_device):
        state = service_with_device.get_device_state("NOTFOUND")
        assert state is None


class TestHexToRgb:
    """Tests for the service's internal _hex_to_rgb method."""

    def test_basic_color(self, service_with_device):
        assert service_with_device._hex_to_rgb("#ff0000") == (255, 0, 0)

    def test_without_hash(self, service_with_device):
        assert service_with_device._hex_to_rgb("00ff41") == (0, 255, 65)


class TestSetLighting:
    """Tests for lighting effect control."""

    def test_static_effect(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "static", "#ff0000", 2, "right")
        assert result is True
        mock_device.fx.static.assert_called_once_with(255, 0, 0)

    def test_spectrum_effect(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "spectrum", "#000000", 2, "right")
        assert result is True
        mock_device.fx.spectrum.assert_called_once()

    def test_wave_right(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "wave", "#000000", 2, "right")
        assert result is True
        mock_device.fx.wave.assert_called_once_with(1)

    def test_wave_left(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "wave", "#000000", 2, "left")
        assert result is True
        mock_device.fx.wave.assert_called_once_with(2)

    def test_reactive_effect(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "reactive", "#00ff00", 2, "right")
        assert result is True
        mock_device.fx.reactive.assert_called_once_with(0, 255, 0, 2)

    def test_breath_effect(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "breath", "#0000ff", 2, "right")
        assert result is True
        mock_device.fx.breath_single.assert_called_once_with(0, 0, 255)

    def test_none_effect(self, service_with_device, mock_device):
        result = service_with_device.set_lighting("XX000000", "matrix", "none", "#000000", 2, "right")
        assert result is True
        mock_device.fx.none.assert_called_once()

    def test_nonexistent_device(self, service_with_device):
        result = service_with_device.set_lighting("NOTFOUND", "matrix", "static", "#ff0000", 2, "right")
        assert result is False

    def test_device_without_fx(self, service_with_device):
        device = MagicMock(spec=[])
        device.serial = "NOFX"
        service_with_device.manager.devices = [device]
        result = service_with_device.set_lighting("NOFX", "matrix", "static", "#ff0000", 2, "right")
        assert result is False


class TestSetPerformance:
    """Tests for DPI and poll rate control."""

    def test_set_dpi(self, service_with_device, mock_device):
        result = service_with_device.set_performance("XX000000", 1600, 1600, None)
        assert result is True
        assert mock_device.dpi == (1600, 1600)

    def test_set_poll_rate(self, service_with_device, mock_device):
        result = service_with_device.set_performance("XX000000", None, None, 500)
        assert result is True
        assert mock_device.poll_rate == 500

    def test_set_both(self, service_with_device, mock_device):
        result = service_with_device.set_performance("XX000000", 3200, 3200, 1000)
        assert result is True
        assert mock_device.dpi == (3200, 3200)
        assert mock_device.poll_rate == 1000

    def test_nonexistent_device(self, service_with_device):
        result = service_with_device.set_performance("NOTFOUND", 800, 800, 500)
        assert result is False
