import json
import logging
import re
from typing import Dict, List
from .config import CONFIG_DIR, ensure_dirs

MACROS_FILE = CONFIG_DIR / "macros.json"


def _sanitize_macro_name(name: str) -> str:
    """Validate and sanitize a macro name."""
    sanitized = re.sub(r'[^a-zA-Z0-9 _\-]', '', name).strip()
    if not sanitized:
        raise ValueError(f"Invalid macro name: {name!r}")
    return sanitized


class MacroManager:
    """
    Manages saved macros and their assignment to device buttons.
    """
    def __init__(self):
        self.macros: Dict[str, List[dict]] = {}
        self.load_macros()

    def load_macros(self):
        """Loads macros from the macros JSON file."""
        if MACROS_FILE.exists():
            try:
                with open(MACROS_FILE, 'r') as f:
                    self.macros = json.load(f)
            except Exception as e:
                logging.error(f"Failed to load macros: {e}")

    def save_macros(self):
        """Saves macros to the macros JSON file."""
        ensure_dirs()
        try:
            with open(MACROS_FILE, 'w') as f:
                json.dump(self.macros, f, indent=4)
        except Exception as e:
            logging.error(f"Failed to save macros: {e}")

    def add_macro(self, name: str, events: List[dict]):
        """Adds a new macro or updates an existing one."""
        safe_name = _sanitize_macro_name(name)
        self.macros[safe_name] = events
        self.save_macros()

    def delete_macro(self, name: str):
        """Deletes a macro by name."""
        if name in self.macros:
            del self.macros[name]
            self.save_macros()

    def get_macro(self, name: str) -> List[dict]:
        """Returns the events for a specific macro."""
        return self.macros.get(name, [])
