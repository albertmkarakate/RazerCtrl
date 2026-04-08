import json
import os

from razerctrl.core.hardware_info import extract_usb_ids


def resolve_device_svg_path(device, base_path: str) -> str:
    """Resolve device-specific generated SVG, with fallback to type generic icon."""
    manifest_path = os.path.join(base_path, "assets", "devices", "generated", "manifest.json")

    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            vendor, product = extract_usb_ids(device)
            usb_id = f"{vendor}:{product}" if vendor and product else None
            if usb_id and usb_id in manifest:
                candidate = os.path.join(base_path, "assets", "devices", manifest[usb_id]["asset"])
                if os.path.exists(candidate):
                    return candidate
        except (json.JSONDecodeError, OSError, KeyError, TypeError):
            pass

    fallback = os.path.join(base_path, "assets", "devices", f"{device.type}_generic.svg")
    if not os.path.exists(fallback):
        fallback = os.path.join(base_path, "assets", "devices", "mouse_generic.svg")
    return fallback
