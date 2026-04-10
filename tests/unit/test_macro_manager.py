"""Tests for razerctrl.core.macro_manager."""
import json
from pathlib import Path
from unittest.mock import patch

import pytest

import razerctrl.core.macro_manager as macro_module
from razerctrl.core.macro_manager import MacroManager


class TestMacroManagerInit:
    """Tests for MacroManager initialization."""

    def test_init_empty_when_no_file(self, tmp_path):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            assert mgr.macros == {}

    def test_init_loads_existing_macros(self, tmp_path):
        fake_file = tmp_path / "macros.json"
        data = {"ctrl_shift_a": [{"key": "KEY_A", "value": 1, "delay": 0}]}
        fake_file.write_text(json.dumps(data))
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            assert "ctrl_shift_a" in mgr.macros

    def test_init_handles_corrupt_file(self, tmp_path):
        fake_file = tmp_path / "macros.json"
        fake_file.write_text("not valid json")
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            assert mgr.macros == {}


class TestMacroManagerAddMacro:
    """Tests for adding macros."""

    def test_add_new_macro(self, tmp_path, sample_macro_events):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("test_macro", sample_macro_events)
            assert mgr.macros["test_macro"] == sample_macro_events
            # Verify persisted
            saved = json.loads(fake_file.read_text())
            assert "test_macro" in saved

    def test_update_existing_macro(self, tmp_path, sample_macro_events):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("test_macro", sample_macro_events)
            new_events = [{"key": "KEY_C", "value": 1, "delay": 0}]
            mgr.add_macro("test_macro", new_events)
            assert mgr.macros["test_macro"] == new_events

    def test_add_multiple_macros(self, tmp_path, sample_macro_events):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("macro_1", sample_macro_events)
            mgr.add_macro("macro_2", [{"key": "KEY_X", "value": 1, "delay": 10}])
            assert len(mgr.macros) == 2

    def test_add_macro_with_empty_events(self, tmp_path):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("empty_macro", [])
            assert mgr.macros["empty_macro"] == []


class TestMacroManagerDeleteMacro:
    """Tests for deleting macros."""

    def test_delete_existing_macro(self, tmp_path, sample_macro_events):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("to_delete", sample_macro_events)
            mgr.delete_macro("to_delete")
            assert "to_delete" not in mgr.macros

    def test_delete_nonexistent_macro(self, tmp_path):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            # Should not raise
            mgr.delete_macro("nonexistent")
            assert mgr.macros == {}

    def test_delete_persists(self, tmp_path, sample_macro_events):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("temp", sample_macro_events)
            mgr.delete_macro("temp")
            saved = json.loads(fake_file.read_text())
            assert "temp" not in saved


class TestMacroManagerGetMacro:
    """Tests for retrieving macros."""

    def test_get_existing_macro(self, tmp_path, sample_macro_events):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("my_macro", sample_macro_events)
            result = mgr.get_macro("my_macro")
            assert result == sample_macro_events

    def test_get_nonexistent_macro(self, tmp_path):
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            result = mgr.get_macro("missing")
            assert result == []

    def test_get_returns_copy_semantics(self, tmp_path, sample_macro_events):
        """Verify get_macro returns the expected list."""
        fake_file = tmp_path / "macros.json"
        with patch.object(macro_module, "MACROS_FILE", fake_file):
            mgr = MacroManager()
            mgr.add_macro("macro", sample_macro_events)
            result = mgr.get_macro("macro")
            assert len(result) == len(sample_macro_events)
