use html2md_rs::to_md::safe_from_html_to_md;
use tauri::api::dialog::message;

#[tauri::command]
pub fn parse_markdown_as_html(file_string: String) -> String {
    markdown::to_html(&file_string)
}

#[tauri::command]
pub fn parse_html_as_markdown(html_string: String, window: tauri::Window) -> String {
    match safe_from_html_to_md(html_string) {
        Ok(md) => md,
        Err(e) => {
            message(
                Some(&window),
                "Error parsing HTML to Markdown",
                format!("Error: {:?}.", e),
            );
            "".to_string()
        }
    }
}
