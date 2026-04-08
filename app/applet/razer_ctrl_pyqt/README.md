# RazerCtrl PyQt6 Application

This is the native Linux PyQt6 implementation of the RazerCtrl concept.

## Features
- Clickable device icons with topographic assets
- Dynamic panel switching based on selected device
- Dark/Neon aesthetic aligned with the web prototype
- Clean component structure ready for OpenRazer integration

## Installation

1. Ensure you have Python 3.x installed.
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

```bash
python main.py
```

## OpenRazer Integration
The `core/devices.py` file currently uses a mock device manager. To integrate with actual hardware, replace the `DeviceManagerMock` with the real OpenRazer `DeviceManager` from the `openrazer` python package.
