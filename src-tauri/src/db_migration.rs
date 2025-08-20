use tauri_plugin_sql::{Migration, MigrationKind};

pub fn create_initial_tables() -> Vec<Migration> {
    println!("===> Apply DB Migration");
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE servers (
                id INTEGER PRIMARY KEY, 
                displayname TEXT,
                hostname TEXT, 
                protocol TEXT,
                port INTEGER,
                timeMilliseconds INTEGER,
                notify INTEGER 
            );",
            kind: MigrationKind::Up,
        },
    ];
    println!("===> DONE!");
    migrations
}
