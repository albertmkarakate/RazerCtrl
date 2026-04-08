from __future__ import annotations

from typing import Any, Optional

RAZER_VENDOR_IDS = {"1532"}


def _to_hex4(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, int):
        return f"{value:04X}"

    text = str(value).strip()
    if not text:
        return None
    if text.lower().startswith("0x"):
        text = text[2:]
    return text.zfill(4).upper()


def extract_usb_ids(device: Any) -> tuple[Optional[str], Optional[str]]:
    """Best-effort extraction of USB vendor/product IDs from a device object."""
    vendor_attrs = ("vendor_id", "vendor", "vid", "usb_vid", "idVendor")
    product_attrs = ("product_id", "product", "pid", "usb_pid", "idProduct")

    vendor = next((_to_hex4(getattr(device, a, None)) for a in vendor_attrs if getattr(device, a, None) is not None), None)
    product = next((_to_hex4(getattr(device, a, None)) for a in product_attrs if getattr(device, a, None) is not None), None)

    if vendor and product:
        return vendor, product

    raw_id = getattr(device, "device_id", None)
    if isinstance(raw_id, str) and ":" in raw_id:
        left, right = raw_id.split(":", 1)
        return _to_hex4(left), _to_hex4(right)

    return vendor, product


def hardware_info(device: Any) -> dict[str, Optional[str]]:
    vendor, product = extract_usb_ids(device)
    device_type = getattr(device, "type", None)
    name = getattr(device, "name", None)
    serial = getattr(device, "serial", None)
    usb_id = f"{vendor}:{product}" if vendor and product else None

    return {
        "name": name,
        "type": device_type,
        "serial": serial,
        "vendor_id": vendor,
        "product_id": product,
        "usb_id": usb_id,
    }


def is_razer_device(device: Any) -> bool:
    vendor, _ = extract_usb_ids(device)
    return bool(vendor and vendor.upper() in RAZER_VENDOR_IDS)
