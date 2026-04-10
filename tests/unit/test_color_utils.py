"""Tests for razerctrl.utils.color_utils."""

# PyQt6 is mocked in conftest.py
from razerctrl.utils.color_utils import hex_to_rgb, rgb_to_hex


class TestHexToRgb:
    """Tests for hex_to_rgb conversion."""

    def test_basic_red(self):
        assert hex_to_rgb("#ff0000") == (255, 0, 0)

    def test_basic_green(self):
        assert hex_to_rgb("#00ff00") == (0, 255, 0)

    def test_basic_blue(self):
        assert hex_to_rgb("#0000ff") == (0, 0, 255)

    def test_white(self):
        assert hex_to_rgb("#ffffff") == (255, 255, 255)

    def test_black(self):
        assert hex_to_rgb("#000000") == (0, 0, 0)

    def test_neon_green(self):
        """The default RazerCtrl green color."""
        assert hex_to_rgb("#00ff41") == (0, 255, 65)

    def test_without_hash(self):
        """Should work without leading #."""
        assert hex_to_rgb("ff8800") == (255, 136, 0)

    def test_mixed_case(self):
        assert hex_to_rgb("#AAbbCC") == (170, 187, 204)

    def test_single_digit_values(self):
        assert hex_to_rgb("#010203") == (1, 2, 3)

    def test_returns_tuple(self):
        result = hex_to_rgb("#ffffff")
        assert isinstance(result, tuple)
        assert len(result) == 3


class TestRgbToHex:
    """Tests for rgb_to_hex conversion."""

    def test_basic_red(self):
        assert rgb_to_hex((255, 0, 0)) == "#ff0000"

    def test_basic_green(self):
        assert rgb_to_hex((0, 255, 0)) == "#00ff00"

    def test_basic_blue(self):
        assert rgb_to_hex((0, 0, 255)) == "#0000ff"

    def test_white(self):
        assert rgb_to_hex((255, 255, 255)) == "#ffffff"

    def test_black(self):
        assert rgb_to_hex((0, 0, 0)) == "#000000"

    def test_neon_green(self):
        assert rgb_to_hex((0, 255, 65)) == "#00ff41"

    def test_returns_lowercase(self):
        result = rgb_to_hex((170, 187, 204))
        assert result == "#aabbcc"
        assert result == result.lower()

    def test_includes_hash_prefix(self):
        result = rgb_to_hex((0, 0, 0))
        assert result.startswith("#")
        assert len(result) == 7


class TestRoundTrip:
    """Tests for hex ↔ RGB round-trip consistency."""

    def test_hex_round_trip(self):
        original = "#1a2b3c"
        assert rgb_to_hex(hex_to_rgb(original)) == original

    def test_rgb_round_trip(self):
        original = (100, 150, 200)
        assert hex_to_rgb(rgb_to_hex(original)) == original

    def test_boundary_values(self):
        assert rgb_to_hex(hex_to_rgb("#000000")) == "#000000"
        assert rgb_to_hex(hex_to_rgb("#ffffff")) == "#ffffff"
