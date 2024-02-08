// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod parser;

use parser::*;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs_watch::init())
        .invoke_handler(tauri::generate_handler![parse_text_to_html_as_markdown])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
