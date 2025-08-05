// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod db_migration;

static DB_URL: &str = "sqlite:mydatabase.db";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // define db path

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations(DB_URL, db_migration::create_initial_tables())
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
