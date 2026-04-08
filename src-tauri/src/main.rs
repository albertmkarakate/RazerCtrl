#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod openrazer;

use openrazer::{get_connected_devices, DbusState, DeviceInfo, set_device_lighting, set_device_brightness, set_device_poll_rate};

#[tauri::command]
async fn get_devices(state: tauri::State<'_, DbusState>) -> Result<Vec<DeviceInfo>, String> {
    get_connected_devices(&state).await
}

#[tauri::command]
async fn set_lighting(state: tauri::State<'_, DbusState>, serial: String, r: u8, g: u8, b: u8) -> Result<(), String> {
    set_device_lighting(&state, serial, r, g, b).await
}

#[tauri::command]
async fn set_brightness(state: tauri::State<'_, DbusState>, serial: String, brightness: f64) -> Result<(), String> {
    set_device_brightness(&state, serial, brightness).await
}

#[tauri::command]
async fn set_poll_rate(state: tauri::State<'_, DbusState>, serial: String, rate: i32) -> Result<(), String> {
    set_device_poll_rate(&state, serial, rate).await
}

fn main() {
    tauri::Builder::default()
        .manage(DbusState::new())
        .invoke_handler(tauri::generate_handler![
            get_devices, 
            set_lighting, 
            set_brightness, 
            set_poll_rate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
