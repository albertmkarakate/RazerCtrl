"""Tests for razerctrl.core.profile_manager."""
import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

import razerctrl.core.profile_manager as pm_module
from razerctrl.core.profile_manager import ProfileManager


@pytest.fixture
def fake_profiles_dir(tmp_path):
    """Provide a temporary profiles directory and patch it."""
    profiles = tmp_path / "profiles"
    profiles.mkdir(parents=True)
    return profiles


@pytest.fixture
def device_manager_mock(mock_device):
    """Mock DeviceManager that returns a known device."""
    dm = MagicMock()
    dm.get_device_by_serial = MagicMock(return_value=mock_device)
    return dm


class TestProfileManagerInit:
    """Tests for ProfileManager initialization."""

    def test_init_with_empty_dir(self, fake_profiles_dir):
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            assert pm.profiles == {}
            assert pm.current_profile_name is None

    def test_init_loads_existing_profiles(self, fake_profiles_dir):
        profile_data = {"name": "Gaming", "devices": {}}
        (fake_profiles_dir / "Gaming.json").write_text(json.dumps(profile_data))
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            assert "Gaming" in pm.profiles

    def test_init_handles_missing_dir(self, tmp_path):
        nonexistent = tmp_path / "does_not_exist"
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", nonexistent):
            pm = ProfileManager(dm)
            assert pm.profiles == {}

    def test_init_handles_corrupt_profile(self, fake_profiles_dir):
        (fake_profiles_dir / "bad.json").write_text("not json")
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            # Corrupt file is skipped
            assert "bad" not in pm.profiles

    def test_init_loads_multiple_profiles(self, fake_profiles_dir):
        for name in ["Gaming", "Work", "Night"]:
            data = {"name": name, "devices": {}}
            (fake_profiles_dir / f"{name}.json").write_text(json.dumps(data))
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            assert len(pm.profiles) == 3


class TestProfileManagerSave:
    """Tests for saving profiles."""

    def test_save_profile(self, fake_profiles_dir):
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            pm.save_profile("TestProfile", {"devices": {}})
            assert "TestProfile" in pm.profiles
            file_path = fake_profiles_dir / "TestProfile.json"
            assert file_path.exists()
            loaded = json.loads(file_path.read_text())
            assert loaded["name"] == "TestProfile"

    def test_save_overwrites_existing(self, fake_profiles_dir):
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            pm.save_profile("P1", {"devices": {}, "version": 1})
            pm.save_profile("P1", {"devices": {}, "version": 2})
            loaded = json.loads((fake_profiles_dir / "P1.json").read_text())
            assert loaded["version"] == 2

    def test_save_adds_name_to_data(self, fake_profiles_dir):
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            pm.save_profile("AutoName", {})
            assert pm.profiles["AutoName"]["name"] == "AutoName"


class TestProfileManagerApply:
    """Tests for applying profiles."""

    def test_apply_sets_current_profile(self, fake_profiles_dir, device_manager_mock, mock_device):
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(device_manager_mock)
            profile_data = {
                "name": "Gaming",
                "devices": {
                    "XX000000": {
                        "lighting": {"effect": "static", "color": [0, 255, 0]},
                    }
                },
            }
            pm.profiles["Gaming"] = profile_data
            pm.apply_profile("Gaming")
            assert pm.current_profile_name == "Gaming"

    def test_apply_calls_device_settings(self, fake_profiles_dir, device_manager_mock, mock_device):
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(device_manager_mock)
            profile_data = {
                "name": "Gaming",
                "devices": {
                    "XX000000": {
                        "lighting": {"effect": "static", "color": [0, 255, 0]},
                    }
                },
            }
            pm.profiles["Gaming"] = profile_data
            pm.apply_profile("Gaming")
            mock_device.fx.static.assert_called_once_with(0, 255, 0)

    def test_apply_nonexistent_profile(self, fake_profiles_dir):
        dm = MagicMock()
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            pm.apply_profile("missing_profile")
            assert pm.current_profile_name is None

    def test_apply_skips_disconnected_device(self, fake_profiles_dir):
        dm = MagicMock()
        dm.get_device_by_serial = MagicMock(return_value=None)
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(dm)
            pm.profiles["P"] = {
                "name": "P",
                "devices": {"UNKNOWN_SERIAL": {"lighting": {"effect": "static"}}}
            }
            # Should not raise even though device is not found
            pm.apply_profile("P")
            assert pm.current_profile_name == "P"


class TestApplyDeviceSettings:
    """Tests for _apply_device_settings."""

    def test_apply_static_lighting(self, fake_profiles_dir, device_manager_mock, mock_device):
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(device_manager_mock)
            settings = {"lighting": {"effect": "static", "color": [255, 0, 0]}}
            pm._apply_device_settings(mock_device, settings)
            mock_device.fx.static.assert_called_once_with(255, 0, 0)

    def test_apply_none_lighting(self, fake_profiles_dir, device_manager_mock, mock_device):
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(device_manager_mock)
            settings = {"lighting": {"effect": "none"}}
            pm._apply_device_settings(mock_device, settings)
            mock_device.fx.none.assert_called_once()

    def test_apply_dpi(self, fake_profiles_dir, device_manager_mock, mock_device):
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(device_manager_mock)
            settings = {"performance": {"dpi": (1600, 1600)}}
            pm._apply_device_settings(mock_device, settings)
            assert mock_device.dpi == (1600, 1600)

    def test_apply_empty_settings(self, fake_profiles_dir, device_manager_mock, mock_device):
        with patch.object(pm_module, "PROFILES_DIR", fake_profiles_dir):
            pm = ProfileManager(device_manager_mock)
            pm._apply_device_settings(mock_device, {})
            mock_device.fx.static.assert_not_called()
