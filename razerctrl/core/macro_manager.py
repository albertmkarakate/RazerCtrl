import json
import logging
from typing import Dict, List
from .config import CONFIG_DIR

MACROS_FILE = CONFIG_DIR / "macros.json"

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
        try:
            with open(MACROS_FILE, 'w') as f:
                json.dump(self.macros, f, indent=4)
        except Exception as e:
            logging.error(f"Failed to save macros: {e}")

    def add_macro(self, name: str, events: List[dict]):
        """Adds a new macro or updates an existing one."""
        self.macros[name] = events
        self.save_macros()

    def delete_macro(self, name: str):
        """Deletes a macro by name."""
        if name in self.macros:
            del self.macros[name]
            self.save_macros()

    def get_macro(self, name: str) -> List[dict]:
        """Returns the events for a specific macro."""
        return self.macros.get(name, [])
