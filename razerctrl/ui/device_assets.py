import json
import os
from typing import Optional


def _normalize_pair(vendor: str, product: str) -> str:
    return f"{vendor.upper()}:{product.upper()}"


def _extract_usb_id(device) -> Optional[str]:
    """Best-effort extraction of USB vendor/product ID from openrazer devices."""
    # Common direct attributes
    vendor_attrs = ("vendor_id", "vendor", "vid", "usb_vid", "idVendor")
    product_attrs = ("product_id", "product", "pid", "usb_pid", "idProduct")

    vendor = None
    product = None

    for attr in vendor_attrs:
        value = getattr(device, attr, None)
        if value is not None:
            vendor = value
            break

    for attr in product_attrs:
        value = getattr(device, attr, None)
        if value is not None:
            product = value
            break

    if vendor is None or product is None:
        raw_id = getattr(device, "device_id", None)
        if isinstance(raw_id, str) and ":" in raw_id:
            left, right = raw_id.split(":", 1)
            return _normalize_pair(left.zfill(4), right.zfill(4))
        return None

    def to_hex4(value) -> str:
        if isinstance(value, int):
            return f"{value:04X}"
        text = str(value).strip()
        text = text[2:] if text.lower().startswith("0x") else text
        return text.zfill(4).upper()

    return _normalize_pair(to_hex4(vendor), to_hex4(product))


def resolve_device_svg_path(device, base_path: str) -> str:
    """Resolve device-specific generated SVG, with fallback to type generic icon."""
    manifest_path = os.path.join(base_path, "assets", "devices", "generated", "manifest.json")

    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            usb_id = _extract_usb_id(device)
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
