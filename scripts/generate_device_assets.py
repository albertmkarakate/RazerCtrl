#!/usr/bin/env python3
"""Generate line-drawn per-device SVG assets from the supported device list."""

from __future__ import annotations

import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SUPPORTED_DEVICES_TS = REPO_ROOT / "src" / "data" / "supported_devices.ts"
TEMPLATES_DIR = REPO_ROOT / "razerctrl" / "assets" / "devices"
OUTPUT_DIR = TEMPLATES_DIR / "generated"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"

CATEGORY_ICONS = {
    "Keyboard": '<rect x="28" y="34" width="84" height="34" rx="6"/><path d="M32 44h76M32 54h76M42 64h56"/>',
    "Mouse": '<path d="M70 30c-15 0-26 11-26 26v20c0 15 11 26 26 26s26-11 26-26V56c0-15-11-26-26-26z"/><path d="M70 30v28"/>',
    "Mousemat": '<rect x="22" y="42" width="96" height="44" rx="8"/><path d="M30 50h80M30 78h80"/>',
    "Headset": '<path d="M40 78V56c0-17 13-30 30-30s30 13 30 30v22"/><rect x="32" y="70" width="16" height="24" rx="5"/><rect x="92" y="70" width="16" height="24" rx="5"/>',
    "Misc": '<rect x="36" y="34" width="68" height="56" rx="10"/><path d="M50 48h40M50 62h40M50 76h24"/>',
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


def short_label(name: str, max_len: int = 28) -> str:
    return name if len(name) <= max_len else f"{name[: max_len - 1]}…"


def render_svg(device_name: str, device_id: str, category: str) -> str:
    glyph = CATEGORY_ICONS.get(category, CATEGORY_ICONS["Misc"])
    label = short_label(device_name)

    return f'''<!-- Auto-generated line asset for {device_name} ({device_id}). -->
<svg width="240" height="140" viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101215"/>
      <stop offset="100%" stop-color="#191d20"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="236" height="136" rx="12" fill="url(#bg)" stroke="#44d62c" stroke-width="2"/>
  <g fill="none" stroke="#44d62c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    {glyph}
  </g>
  <text x="16" y="112" fill="#f4f7f2" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="12">{label}</text>
  <text x="16" y="128" fill="#8aa386" font-family="monospace" font-size="11">{device_id}</text>
  <text x="224" y="128" text-anchor="end" fill="#9fcf96" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="11">{category}</text>
</svg>
'''


def generate_assets(devices: list[dict[str, str]]) -> dict[str, dict[str, str]]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, str]] = {}

    for device in devices:
        device_id = device["id"].upper()
        category = device["category"]
        name = device["name"]
        filename = f"{normalize_id(device_id)}.svg"
        out_path = OUTPUT_DIR / filename

        out_path.write_text(render_svg(name, device_id, category), encoding="utf-8")

        manifest[device_id] = {
            "name": name,
            "category": category,
            "asset": f"generated/{filename}",
            "style": "line-drawn-card",
        }

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    parsed = load_supported_devices()
    generated = generate_assets(parsed)
    print(f"Generated {len(generated)} line-drawn device assets in {OUTPUT_DIR}")
