from pathlib import Path


PACKAGE_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PACKAGE_ROOT / "assets"
DEVICE_ASSETS_DIR = ASSETS_DIR / "devices"


def device_svg_path(device_type: str) -> str:
    """
    Resolves an absolute path for a device SVG asset.
    Falls back to the generic mouse icon when a specific icon is unavailable.
    """
    candidate = DEVICE_ASSETS_DIR / f"{device_type}_generic.svg"
    if candidate.exists():
        return str(candidate)
    return str(DEVICE_ASSETS_DIR / "mouse_generic.svg")

