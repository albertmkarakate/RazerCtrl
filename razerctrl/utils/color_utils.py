from PyQt6.QtGui import QColor
from typing import Tuple


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """
    Convert a hex color string to an RGB tuple.

    Accepts formats:
    - "#RRGGBB"
    - "RRGGBB"

    Raises:
        ValueError: If the input is not a valid hex color.
    """
    if not isinstance(hex_color, str):
        raise TypeError("hex_color must be a string")

    hex_color = hex_color.strip().lstrip('#')

    if len(hex_color) != 6:
        raise ValueError(f"Invalid hex color length: '{hex_color}'")

    try:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    except ValueError:
        raise ValueError(f"Invalid hex color value: '{hex_color}'")


def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    """
    Convert an RGB tuple to a hex color string (#RRGGBB).

    Raises:
        ValueError: If RGB values are out of range.
    """
    if len(rgb) != 3:
        raise ValueError("RGB tuple must have exactly 3 values")

    if not all(isinstance(v, int) for v in rgb):
        raise TypeError("RGB values must be integers")

    if not all(0 <= v <= 255 for v in rgb):
        raise ValueError(f"RGB values must be in range 0–255: {rgb}")

    return '#{:02X}{:02X}{:02X}'.format(*rgb)


def qcolor_to_rgb(color: QColor) -> Tuple[int, int, int]:
    """
    Convert a QColor object to an RGB tuple.
    """
    if not isinstance(color, QColor):
        raise TypeError("color must be a QColor instance")

    return (color.red(), color.green(), color.blue())
