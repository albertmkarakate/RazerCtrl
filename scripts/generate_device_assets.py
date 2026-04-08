#!/usr/bin/env python3
"""Generate per-device SVG assets from category generic templates."""

from __future__ import annotations

import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SUPPORTED_DEVICES_TS = REPO_ROOT / "src" / "data" / "supported_devices.ts"
TEMPLATES_DIR = REPO_ROOT / "razerctrl" / "assets" / "devices"
OUTPUT_DIR = TEMPLATES_DIR / "generated"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"

CATEGORY_TO_TEMPLATE = {
    "Keyboard": "keyboard_generic.svg",
    "Mouse": "mouse_generic.svg",
    "Mousemat": "mousemat_generic.svg",
    "Headset": "headset_generic.svg",
    "Misc": "accessory_generic.svg",
}

ENTRY_PATTERN = re.compile(
    r'\{\s*name:\s*"(?P<name>.+?)",\s*id:\s*"(?P<id>[0-9A-Fa-f]{4}:[0-9A-Fa-f]{4})",\s*category:\s*"(?P<category>[A-Za-z]+)"\s*\}',
)


def load_supported_devices() -> list[dict[str, str]]:
    text = SUPPORTED_DEVICES_TS.read_text(encoding="utf-8")
    devices = [m.groupdict() for m in ENTRY_PATTERN.finditer(text)]
    if not devices:
        raise RuntimeError(f"No devices found in {SUPPORTED_DEVICES_TS}")
    return devices


def normalize_id(device_id: str) -> str:
    return device_id.lower().replace(":", "_")


def generate_assets(devices: list[dict[str, str]]) -> dict[str, dict[str, str]]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest: dict[str, dict[str, str]] = {}

    for device in devices:
        category = device["category"]
        template_name = CATEGORY_TO_TEMPLATE.get(category, "accessory_generic.svg")
        template_path = TEMPLATES_DIR / template_name
        if not template_path.exists():
            raise FileNotFoundError(f"Missing template: {template_path}")

        device_id = device["id"]
        device_filename = f"{normalize_id(device_id)}.svg"
        out_path = OUTPUT_DIR / device_filename

        template_svg = template_path.read_text(encoding="utf-8")
        generated_svg = (
            f"<!-- Auto-generated for {device['name']} ({device_id}) using {template_name}. -->\n"
            f"{template_svg}"
        )
        out_path.write_text(generated_svg, encoding="utf-8")

        manifest[device_id] = {
            "name": device["name"],
            "category": category,
            "template": template_name,
            "asset": f"generated/{device_filename}",
        }

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    devices = load_supported_devices()
    manifest = generate_assets(devices)
    print(f"Generated {len(manifest)} device assets in {OUTPUT_DIR}")
