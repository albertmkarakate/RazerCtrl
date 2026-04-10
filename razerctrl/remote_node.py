from flask import Flask
import openrazer.client

app = Flask(__name__)
client = openrazer.client.DeviceManager()

@app.route("/set_color/<color>")
def set_color(color):
    for device in client.devices:
        if color == "green":
            device.fx.static(0, 255, 0)
        elif color == "red":
            device.fx.static(255, 0, 0)
        elif color == "blue":
            device.fx.static(0, 0, 255)
    return "OK"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
