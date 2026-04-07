import sys
import os

# Add the parent directory to sys.path to allow imports if running directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from razerctrl.app import RazerCtrlApp

def main():
    """Application entry point."""
    app = RazerCtrlApp(sys.argv)
    sys.exit(app.run())

if __name__ == "__main__":
    main()
