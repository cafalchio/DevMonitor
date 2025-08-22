// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod db_migration;

use futures::future::join_all;
use httping::{ping, ping_with_metrics};
use serde::Serialize;
use std::net::Ipv4Addr;

static ONLINE_SERVERS: [&str; 3] = ["www.google.com", "one.one.one.one", "www.amazon.com"];
static DB_URL: &str = "sqlite:data.db";

#[tauri::command]
async fn check_online() -> bool {
    let futures = ONLINE_SERVERS
        .iter()
        .map(|&server| async move { ping(server, "", "https", 443).await.is_ok() });

    join_all(futures).await.into_iter().any(|b| b)
}

#[derive(Serialize)]
struct PingResult {
    server_name: String,
    success: bool,
    rtt: u64,
}

#[tauri::command]
async fn ping_server(domain: &str, protocol: &str, port: u32) -> Result<PingResult, String> {
    let mut ip = "".to_string();
    let mut server_domain = domain.to_string();

    if domain.parse::<Ipv4Addr>().is_ok() {
        ip = server_domain.clone();
        server_domain = "".to_string();
    }
    match ping_with_metrics(&server_domain, &ip, protocol, port).await {
        Ok(v) => Ok(PingResult {
            server_name: domain.to_string(),
            success: v.success,
            rtt: v.rtt as u64,
        }),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations(DB_URL, db_migration::create_initial_tables())
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        // Combine commands in ONE handler:
        .invoke_handler(tauri::generate_handler![check_online, ping_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
