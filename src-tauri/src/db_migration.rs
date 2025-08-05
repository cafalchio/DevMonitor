use tauri_plugin_sql::{Migration, MigrationKind};

pub fn create_initial_tables() -> Vec<Migration> {
    println!("===> Apply DB Migration");
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "Add first value",
            sql: "INSERT OR REPLACE INTO users (id, name) VALUES (1, 'First Person')",
            kind: MigrationKind::Up,
        },
    ];
    println!("===> DONE!");
    migrations
}
