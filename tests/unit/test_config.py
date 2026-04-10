"""Tests for razerctrl.core.config."""
import json
from pathlib import Path
from unittest.mock import patch

import pytest

import razerctrl.core.config as config_module


class TestEnsureDirs:
    """Tests for ensure_dirs()."""

    def test_creates_directories(self, tmp_path):
        cfg = tmp_path / "config" / "razerctrl"
        profiles = cfg / "profiles"
        with patch.object(config_module, "CONFIG_DIR", cfg), \
             patch.object(config_module, "PROFILES_DIR", profiles):
            config_module.ensure_dirs()
            assert cfg.is_dir()
            assert profiles.is_dir()

    def test_idempotent(self, tmp_path):
        """Calling ensure_dirs twice should not raise."""
        cfg = tmp_path / "config" / "razerctrl"
        profiles = cfg / "profiles"
        with patch.object(config_module, "CONFIG_DIR", cfg), \
             patch.object(config_module, "PROFILES_DIR", profiles):
            config_module.ensure_dirs()
            config_module.ensure_dirs()
            assert cfg.is_dir()


class TestLoadConfig:
    """Tests for load_config()."""

    def test_returns_empty_dict_when_no_file(self, tmp_path):
        fake_config = tmp_path / "nonexistent.json"
        with patch.object(config_module, "CONFIG_FILE", fake_config):
            result = config_module.load_config()
            assert result == {}

    def test_loads_valid_json(self, tmp_path):
        fake_config = tmp_path / "config.json"
        data = {"theme": "dark", "dpi": 800}
        fake_config.write_text(json.dumps(data))
        with patch.object(config_module, "CONFIG_FILE", fake_config):
            result = config_module.load_config()
            assert result == data

    def test_returns_empty_dict_on_invalid_json(self, tmp_path):
        fake_config = tmp_path / "config.json"
        fake_config.write_text("{invalid json}")
        with patch.object(config_module, "CONFIG_FILE", fake_config):
            result = config_module.load_config()
            assert result == {}

    def test_loads_empty_object(self, tmp_path):
        fake_config = tmp_path / "config.json"
        fake_config.write_text("{}")
        with patch.object(config_module, "CONFIG_FILE", fake_config):
            result = config_module.load_config()
            assert result == {}

    def test_loads_nested_config(self, tmp_path):
        fake_config = tmp_path / "config.json"
        data = {"lighting": {"effect": "static", "color": "#00ff41"}}
        fake_config.write_text(json.dumps(data))
        with patch.object(config_module, "CONFIG_FILE", fake_config):
            result = config_module.load_config()
            assert result["lighting"]["effect"] == "static"


class TestSaveConfig:
    """Tests for save_config()."""

    def test_saves_config(self, tmp_path):
        cfg = tmp_path / "config" / "razerctrl"
        profiles = cfg / "profiles"
        fake_config = cfg / "config.json"
        with patch.object(config_module, "CONFIG_DIR", cfg), \
             patch.object(config_module, "PROFILES_DIR", profiles), \
             patch.object(config_module, "CONFIG_FILE", fake_config):
            data = {"theme": "neon", "brightness": 100}
            config_module.save_config(data)
            assert fake_config.exists()
            loaded = json.loads(fake_config.read_text())
            assert loaded == data

    def test_save_creates_dirs(self, tmp_path):
        cfg = tmp_path / "new" / "config" / "razerctrl"
        profiles = cfg / "profiles"
        fake_config = cfg / "config.json"
        with patch.object(config_module, "CONFIG_DIR", cfg), \
             patch.object(config_module, "PROFILES_DIR", profiles), \
             patch.object(config_module, "CONFIG_FILE", fake_config):
            config_module.save_config({"key": "value"})
            assert cfg.is_dir()
            assert fake_config.exists()

    def test_overwrites_existing_config(self, tmp_path):
        cfg = tmp_path / "config" / "razerctrl"
        profiles = cfg / "profiles"
        cfg.mkdir(parents=True)
        profiles.mkdir(parents=True)
        fake_config = cfg / "config.json"
        fake_config.write_text(json.dumps({"old": True}))
        with patch.object(config_module, "CONFIG_DIR", cfg), \
             patch.object(config_module, "PROFILES_DIR", profiles), \
             patch.object(config_module, "CONFIG_FILE", fake_config):
            config_module.save_config({"new": True})
            loaded = json.loads(fake_config.read_text())
            assert loaded == {"new": True}
