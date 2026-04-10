"""Tests for razerctrl.backend.profile_store."""
import json
import os
from unittest.mock import patch

import pytest

from razerctrl.backend.profile_store import ProfileStore


@pytest.fixture
def store(tmp_path):
    """Creates a ProfileStore with a temporary directory."""
    s = ProfileStore.__new__(ProfileStore)
    s.profile_dir = str(tmp_path)
    return s


class TestListProfiles:
    """Tests for listing profiles."""

    def test_empty_dir(self, store, tmp_path):
        assert store.list_profiles() == []

    def test_lists_json_files_only(self, store, tmp_path):
        (tmp_path / "gaming.json").write_text("{}")
        (tmp_path / "work.json").write_text("{}")
        (tmp_path / "readme.txt").write_text("ignore me")
        result = store.list_profiles()
        assert sorted(result) == ["gaming", "work"]

    def test_strips_json_extension(self, store, tmp_path):
        (tmp_path / "my_profile.json").write_text("{}")
        result = store.list_profiles()
        assert result == ["my_profile"]


class TestGetProfile:
    """Tests for getting a profile."""

    def test_get_existing(self, store, tmp_path):
        data = {"name": "Gaming", "dpi": 1600}
        (tmp_path / "Gaming.json").write_text(json.dumps(data))
        result = store.get_profile("Gaming")
        assert result == data

    def test_get_nonexistent(self, store):
        result = store.get_profile("nonexistent")
        assert result is None

    def test_get_returns_full_data(self, store, tmp_path):
        data = {
            "name": "Complex",
            "devices": {"XX000000": {"lighting": {"effect": "static"}}},
        }
        (tmp_path / "Complex.json").write_text(json.dumps(data))
        result = store.get_profile("Complex")
        assert result["devices"]["XX000000"]["lighting"]["effect"] == "static"


class TestSaveProfile:
    """Tests for saving profiles."""

    def test_save_new_profile(self, store, tmp_path):
        data = {"name": "New", "settings": {"dpi": 800}}
        store.save_profile("New", data)
        saved = json.loads((tmp_path / "New.json").read_text())
        assert saved == data

    def test_save_overwrites(self, store, tmp_path):
        store.save_profile("P", {"v": 1})
        store.save_profile("P", {"v": 2})
        loaded = json.loads((tmp_path / "P.json").read_text())
        assert loaded["v"] == 2

    def test_save_returns_true(self, store):
        result = store.save_profile("test", {})
        assert result is True


class TestDeleteProfile:
    """Tests for deleting profiles."""

    def test_delete_existing(self, store, tmp_path):
        (tmp_path / "todelete.json").write_text("{}")
        result = store.delete_profile("todelete")
        assert result is True
        assert not (tmp_path / "todelete.json").exists()

    def test_delete_nonexistent(self, store):
        result = store.delete_profile("ghost")
        assert result is False

    def test_delete_only_target(self, store, tmp_path):
        (tmp_path / "keep.json").write_text("{}")
        (tmp_path / "remove.json").write_text("{}")
        store.delete_profile("remove")
        assert (tmp_path / "keep.json").exists()
        assert not (tmp_path / "remove.json").exists()
