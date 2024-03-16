// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod parser;

use parser::*;

#[tauri::command]
fn rename_file(src: String, dest: String) -> Result<(), String> {
    std::thread::sleep(std::time::Duration::from_secs(1));
    match std::fs::rename(&src, dest) {
        Ok(_) => {
            println!("File moved successfully");
            Ok(())
        }
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs_watch::init())
        .invoke_handler(tauri::generate_handler![
            parse_markdown_as_html,
            parse_html_as_markdown,
            rename_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
