#[derive(Debug, Default)]
pub struct Vault {
    pub path: String,
    pub open_path: Option<String>,
}

impl Vault {
    pub fn new(path: String) -> Vault {
        Vault::default()
    }

    pub fn update_path(&mut self, path: String) {
        self.path = path;
    }
}

#[tauri::command]
pub fn select_vault() -> String {
    "Hello, world!".to_string()
}
