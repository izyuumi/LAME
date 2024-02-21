use html2md_rs::{parser::parse_html, to_md::to_md};

#[tauri::command]
pub fn parse_markdown_as_html(file_string: String) -> String {
    markdown::to_html(&file_string)
}

#[tauri::command]
pub fn parse_html_as_markdown(html_string: String) -> String {
    to_md(parse_html(html_string))
}
