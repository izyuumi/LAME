// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn parse_text_to_markdown(file_string: String) -> String {
    let mut result = String::new();
    let mut in_code_block = false;
    for line in file_string.lines() {
        let chars: Vec<char> = line.chars().collect();
        if chars.len() == 0 {
            continue;
        }
        match chars[0] {
            '#' => {
                let mut count = 0;
                for c in chars {
                    if c == '#' {
                        count += 1;
                    } else {
                        break;
                    }
                }
                if count > 6 {
                    result.push_str(&format!("<p>{}</p>", &line));
                } else {
                    result.push_str(&format!(
                        "<h{}>{} {}</h{}>",
                        count,
                        '#'.to_string().repeat(count),
                        &line[count..],
                        count
                    ));
                }
            }
            '*' => result.push_str(&format!("<li>{}</li>", &line[2..])),
            '`' => {
                if in_code_block {
                    result.push_str("</code></pre>");
                } else {
                    result.push_str("<pre><code>");
                }
                in_code_block = !in_code_block;
            }
            _ => result.push_str(&format!("<p>{}</p>", &line)),
        }
    }
    result
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![parse_text_to_markdown])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
