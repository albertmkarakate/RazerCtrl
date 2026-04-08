use serde::{Deserialize, Serialize};
use zbus::{dbus_proxy, Connection};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeviceInfo {
    pub name: String,
    pub serial: String,
    pub device_type: String,
    pub battery_level: Option<i32>,
    pub is_charging: bool,
}

#[dbus_proxy(
    interface = "org.razer.manager",
    default_service = "org.razer",
    default_path = "/org/razer"
)]
trait RazerManager {
    #[dbus_proxy(property)]
    fn devices(&self) -> zbus::Result<Vec<String>>;
}

#[dbus_proxy(
    interface = "org.razer.device",
    default_service = "org.razer"
)]
trait RazerDevice {
    #[dbus_proxy(property)]
    fn device_name(&self) -> zbus::Result<String>;
    #[dbus_proxy(property)]
    fn serial(&self) -> zbus::Result<String>;
    #[dbus_proxy(property)]
    fn device_type(&self) -> zbus::Result<String>;
    #[dbus_proxy(property)]
    fn battery_level(&self) -> zbus::Result<i32>;
    #[dbus_proxy(property)]
    fn is_charging(&self) -> zbus::Result<bool>;
    
    // Lighting methods
    fn set_static(&self, r: u8, g: u8, b: u8) -> zbus::Result<()>;
    fn set_brightness(&self, brightness: f64) -> zbus::Result<()>;
    fn set_none(&self) -> zbus::Result<()>;
    fn set_breath(&self, r1: u8, g1: u8, b1: u8, r2: u8, g2: u8, b2: u8) -> zbus::Result<()>;
    
    // Performance methods
    #[dbus_proxy(property)]
    fn poll_rate(&self) -> zbus::Result<i32>;
    #[dbus_proxy(property)]
    fn set_poll_rate(&self, rate: i32) -> zbus::Result<()>;
}

pub async fn set_device_lighting(serial: String, r: u8, g: u8, b: u8) -> Result<(), String> {
    let connection = Connection::session().await.map_err(|e| e.to_string())?;
    let path = format!("/org/razer/device/{}", serial);
    let device = RazerDeviceProxy::builder(&connection)
        .path(path)
        .map_err(|e| e.to_string())?
        .build()
        .await
        .map_err(|e| e.to_string())?;
        
    device.set_static(r, g, b).await.map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn set_device_brightness(serial: String, brightness: f64) -> Result<(), String> {
    let connection = Connection::session().await.map_err(|e| e.to_string())?;
    let path = format!("/org/razer/device/{}", serial);
    let device = RazerDeviceProxy::builder(&connection)
        .path(path)
        .map_err(|e| e.to_string())?
        .build()
        .await
        .map_err(|e| e.to_string())?;
        
    device.set_brightness(brightness).await.map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn set_device_poll_rate(serial: String, rate: i32) -> Result<(), String> {
    let connection = Connection::session().await.map_err(|e| e.to_string())?;
    let path = format!("/org/razer/device/{}", serial);
    let device = RazerDeviceProxy::builder(&connection)
        .path(path)
        .map_err(|e| e.to_string())?
        .build()
        .await
        .map_err(|e| e.to_string())?;
        
    device.set_poll_rate(rate).await.map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn get_connected_devices() -> Result<Vec<DeviceInfo>, String> {
    let connection = Connection::session().await.map_err(|e| e.to_string())?;
    let manager = RazerManagerProxy::new(&connection).await.map_err(|e| e.to_string())?;
    
    let device_serials = manager.devices().await.map_err(|e| e.to_string())?;
    let mut devices = Vec::new();
    
    for serial in device_serials {
        let path = format!("/org/razer/device/{}", serial);
        let device = RazerDeviceProxy::builder(&connection)
            .path(path)
            .map_err(|e| e.to_string())?
            .build()
            .await
            .map_err(|e| e.to_string())?;
            
        let name = device.device_name().await.unwrap_or_else(|_| "Unknown Device".to_string());
        let device_type = device.device_type().await.unwrap_or_else(|_| "unknown".to_string());
        
        // Rust's Option and Result types force us to handle missing battery levels safely
        let battery_level = device.battery_level().await.ok();
        let is_charging = device.is_charging().await.unwrap_or(false);
        
        devices.push(DeviceInfo {
            name,
            serial,
            device_type,
            battery_level,
            is_charging,
        });
    }
    
    Ok(devices)
}
