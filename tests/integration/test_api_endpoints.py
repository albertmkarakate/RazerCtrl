"""Tests for razerctrl.backend.main (FastAPI endpoints)."""
import sys
from unittest.mock import MagicMock, patch, AsyncMock

import pytest

# External deps are mocked in conftest.py

from razerctrl.backend.main import app, razer_service, profile_store, remap_service

# Use httpx for async testing of FastAPI
from httpx import AsyncClient, ASGITransport


@pytest.fixture
def mock_razer_devices():
    """Mock razer_service to return test devices."""
    return [
        {
            "id": "XX000000",
            "name": "Razer DeathAdder V2",
            "type": "mouse",
            "vid_pid": "1532:0084",
            "capabilities": {
                "has_lighting": True,
                "has_dpi": True,
                "has_poll_rate": True,
                "has_matrix": True,
                "max_dpi": 20000,
            },
        }
    ]


@pytest.fixture
def transport():
    return ASGITransport(app=app)


@pytest.mark.asyncio
class TestGetDevices:
    """Tests for GET /api/devices."""

    async def test_success(self, transport, mock_razer_devices):
        with patch.object(razer_service, "get_devices", return_value=mock_razer_devices):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/api/devices")
            assert resp.status_code == 200
            data = resp.json()
            assert len(data) == 1
            assert data[0]["name"] == "Razer DeathAdder V2"

    async def test_daemon_not_running(self, transport):
        with patch.object(razer_service, "get_devices", side_effect=RuntimeError("daemon not running")):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/api/devices")
            assert resp.status_code == 503


@pytest.mark.asyncio
class TestGetDevice:
    """Tests for GET /api/device/{serial}."""

    async def test_found(self, transport):
        state = {"serial": "XX000000", "name": "Test", "battery": 80}
        with patch.object(razer_service, "get_device_state", return_value=state):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/api/device/XX000000")
            assert resp.status_code == 200
            assert resp.json()["serial"] == "XX000000"

    async def test_not_found(self, transport):
        with patch.object(razer_service, "get_device_state", return_value=None):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/api/device/NOTFOUND")
            assert resp.status_code == 404


@pytest.mark.asyncio
class TestSetLighting:
    """Tests for POST /api/lighting."""

    async def test_success(self, transport):
        with patch.object(razer_service, "set_lighting", return_value=True):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.post("/api/lighting", json={
                    "serial": "XX000000",
                    "effect": "static",
                    "colour_hex": "#ff0000",
                })
            assert resp.status_code == 200
            assert resp.json()["status"] == "success"

    async def test_failure(self, transport):
        with patch.object(razer_service, "set_lighting", return_value=False):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.post("/api/lighting", json={
                    "serial": "XX000000",
                    "effect": "static",
                })
            assert resp.status_code == 400


@pytest.mark.asyncio
class TestSetPerformance:
    """Tests for POST /api/performance."""

    async def test_success(self, transport):
        with patch.object(razer_service, "set_performance", return_value=True):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.post("/api/performance", json={
                    "serial": "XX000000",
                    "dpi_x": 1600,
                    "dpi_y": 1600,
                })
            assert resp.status_code == 200

    async def test_failure(self, transport):
        with patch.object(razer_service, "set_performance", return_value=False):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.post("/api/performance", json={
                    "serial": "XX000000",
                })
            assert resp.status_code == 400


@pytest.mark.asyncio
class TestProfiles:
    """Tests for profile CRUD endpoints."""

    async def test_list_profiles(self, transport):
        with patch.object(profile_store, "list_profiles", return_value=["Gaming", "Work"]):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/api/profiles")
            assert resp.status_code == 200
            assert resp.json() == ["Gaming", "Work"]

    async def test_save_profile(self, transport):
        with patch.object(profile_store, "save_profile") as mock_save:
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.post("/api/profiles", json={
                    "name": "New",
                    "data": {"devices": {}},
                })
            assert resp.status_code == 200
            mock_save.assert_called_once_with("New", {"devices": {}})

    async def test_delete_profile_success(self, transport):
        with patch.object(profile_store, "delete_profile", return_value=True):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.delete("/api/profiles/Gaming")
            assert resp.status_code == 200

    async def test_delete_profile_not_found(self, transport):
        with patch.object(profile_store, "delete_profile", return_value=False):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.delete("/api/profiles/Missing")
            assert resp.status_code == 404


@pytest.mark.asyncio
class TestRemapping:
    """Tests for input remapping endpoints."""

    async def test_list_presets(self, transport):
        with patch.object(remap_service, "list_presets", return_value=["gaming", "work"]):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/api/remap/MyMouse")
            assert resp.status_code == 200
            assert resp.json() == ["gaming", "work"]

    async def test_save_preset(self, transport):
        with patch.object(remap_service, "save_preset", return_value=True), \
             patch.object(remap_service, "start_injection"):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.post("/api/remap", json={
                    "device_name": "MyMouse",
                    "preset_name": "gaming",
                    "mappings": [{"trigger": "BTN_SIDE", "action": {"type": "remap", "value": 30}}],
                })
            assert resp.status_code == 200


@pytest.mark.asyncio
class TestSetColorSimple:
    """Tests for GET /set_color/{color_name}."""

    async def test_known_color(self, transport):
        with patch.object(razer_service, "get_devices", return_value=[{"id": "XX000000", "name": "Test"}]), \
             patch.object(razer_service, "set_lighting", return_value=True):
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/set_color/green")
            assert resp.status_code == 200
            body = resp.json()
            assert body["color"] == "green"

    async def test_unknown_color_defaults(self, transport):
        with patch.object(razer_service, "get_devices", return_value=[{"id": "XX000000", "name": "Test"}]), \
             patch.object(razer_service, "set_lighting", return_value=True) as mock_set:
            async with AsyncClient(transport=transport, base_url="http://test") as ac:
                resp = await ac.get("/set_color/purple")
            assert resp.status_code == 200
            # Should default to green (#00ff41)
            mock_set.assert_called_once_with("XX000000", "matrix", "static", "#00ff41", 2, "right")
