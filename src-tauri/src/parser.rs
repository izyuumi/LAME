#[tauri::command]
pub fn parse_markdown_as_html(file_string: String) -> String {
    markdown::to_html(&file_string)
}
