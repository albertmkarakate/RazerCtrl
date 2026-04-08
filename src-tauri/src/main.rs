#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod openrazer;

use openrazer::{
    get_connected_devices, set_device_brightness, set_device_lighting, set_device_poll_rate,
    DeviceInfo,
};

#[tauri::command]
async fn get_devices() -> Result<Vec<DeviceInfo>, String> {
    get_connected_devices().await
}

#[tauri::command]
async fn set_lighting(serial: String, r: u8, g: u8, b: u8) -> Result<(), String> {
    set_device_lighting(serial, r, g, b).await
}

#[tauri::command]
async fn set_brightness(serial: String, brightness: f64) -> Result<(), String> {
    set_device_brightness(serial, brightness).await
}

#[tauri::command]
async fn set_poll_rate(serial: String, rate: i32) -> Result<(), String> {
    set_device_poll_rate(serial, rate).await
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_devices,
            set_lighting,
            set_brightness,
            set_poll_rate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
