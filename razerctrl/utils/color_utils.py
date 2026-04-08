from PyQt6.QtGui import QColor


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Converts hex color string to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    """Converts RGB tuple to hex color string."""
    return '#{:02x}{:02x}{:02x}'.format(*rgb)


def qcolor_to_rgb(color: QColor) -> tuple[int, int, int]:
    """Converts QColor to RGB tuple."""
    return (color.red(), color.green(), color.blue())