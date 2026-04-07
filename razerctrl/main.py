import sys
import os

# Add the parent directory to sys.path to allow imports if running directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from razerctrl.app import RazerCtrlApp

def main():
    """Application entry point."""
    try:
        app = RazerCtrlApp(sys.argv)
        sys.exit(app.run())
    except Exception as e:
        print(f"[RazerCtrl] FATAL ERROR during startup: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
