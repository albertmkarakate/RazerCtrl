"""Tests for razerctrl.backend.inputremapper_service."""
import json
import os
from unittest.mock import patch, MagicMock

import pytest

from razerctrl.backend.inputremapper_service import InputRemapperService


@pytest.fixture
def service(tmp_path):
    """Creates an InputRemapperService with a temporary preset directory."""
    svc = InputRemapperService.__new__(InputRemapperService)
    svc.preset_dir = str(tmp_path)
    return svc


class TestListPresets:
    """Tests for listing device presets."""

    def test_empty_device_dir(self, service, tmp_path):
        device_dir = tmp_path / "MyMouse"
        device_dir.mkdir()
        assert service.list_presets("MyMouse") == []

    def test_device_dir_not_exists(self, service):
        assert service.list_presets("NoSuchDevice") == []

    def test_lists_json_presets(self, service, tmp_path):
        device_dir = tmp_path / "MyMouse"
        device_dir.mkdir()
        (device_dir / "gaming.json").write_text('{"mappings": []}')
        (device_dir / "work.json").write_text('{"mappings": []}')
        (device_dir / "readme.txt").write_text("not a preset")
        result = service.list_presets("MyMouse")
        assert sorted(result) == ["gaming", "work"]


class TestSavePreset:
    """Tests for saving presets."""

    def test_save_creates_device_dir(self, service, tmp_path):
        mappings = [{"trigger": "BTN_SIDE", "action": {"type": "remap", "value": 30}}]
        result = service.save_preset("NewDevice", "my_preset", mappings)
        assert result is True
        assert (tmp_path / "NewDevice").is_dir()

    def test_save_writes_json(self, service, tmp_path):
        mappings = [{"trigger": "BTN_SIDE", "action": {"type": "remap", "value": 30}}]
        service.save_preset("Dev", "preset1", mappings)
        path = tmp_path / "Dev" / "preset1.json"
        assert path.exists()
        loaded = json.loads(path.read_text())
        assert loaded["mappings"] == mappings

    def test_save_overwrites(self, service, tmp_path):
        service.save_preset("Dev", "p", [{"old": True}])
        service.save_preset("Dev", "p", [{"new": True}])
        loaded = json.loads((tmp_path / "Dev" / "p.json").read_text())
        assert loaded["mappings"] == [{"new": True}]


class TestStartInjection:
    """Tests for starting input remapping injection."""

    @patch("razerctrl.backend.inputremapper_service.subprocess")
    def test_start_calls_subprocess(self, mock_subprocess, service):
        result = service.start_injection("MyMouse", "gaming")
        assert result is True
        mock_subprocess.run.assert_called_once_with(
            ["input-remapper-control", "--command", "start", "--device", "MyMouse", "--preset", "gaming"]
        )


class TestStopInjection:
    """Tests for stopping input remapping injection."""

    @patch("razerctrl.backend.inputremapper_service.subprocess")
    def test_stop_calls_subprocess(self, mock_subprocess, service):
        result = service.stop_injection("MyMouse")
        assert result is True
        mock_subprocess.run.assert_called_once_with(
            ["input-remapper-control", "--command", "stop", "--device", "MyMouse"]
        )
