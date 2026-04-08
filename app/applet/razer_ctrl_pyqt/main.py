import sys
import os
from PyQt6.QtWidgets import QApplication
from ui.main_window import MainWindow

def fix_working_directory():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

def main():
    fix_working_directory()

    app = QApplication(sys.argv)
    
    # Apply global neon theme
    app.setStyleSheet("""
        QWidget {
            background-color: #0b0f10;
            color: #00FF88;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        QLabel {
            font-size: 14px;
            color: #00FF88;
        }
        QSlider::groove:horizontal {
            height: 6px;
            background: #222;
            border-radius: 3px;
        }
        QSlider::handle:horizontal {
            background: #00FF88;
            width: 14px;
            margin: -5px 0;
            border-radius: 7px;
        }
    """)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())

if __name__ == "__main__":
    main()
