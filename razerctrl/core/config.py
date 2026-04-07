import json
import os
import logging
from pathlib import Path

CONFIG_DIR = Path.home() / ".config" / "razerctrl"
CONFIG_FILE = CONFIG_DIR / "config.json"
PROFILES_DIR = CONFIG_DIR / "profiles"
LOG_FILE = CONFIG_DIR / "razerctrl.log"

def ensure_dirs():
    """Ensures that the config and profiles directories exist."""
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    PROFILES_DIR.mkdir(parents=True, exist_ok=True)

def setup_logging():
    """Sets up logging to a file in the config directory."""
    ensure_dirs()
    logging.basicConfig(
        filename=str(LOG_FILE),
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def load_config() -> dict:
    """Loads the application configuration from a JSON file."""
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            logging.error(f"Failed to load config: {e}")
    return {}

def save_config(config: dict):
    """Saves the application configuration to a JSON file."""
    ensure_dirs()
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=4)
    except Exception as e:
        logging.error(f"Failed to save config: {e}")
