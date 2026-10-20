#[cfg(windows)]
fn embed_icon() {
    let mut res = winresource::WindowsResource::new();
    res.set_icon("assets/icon.ico");
    if let Err(e) = res.compile() {
        eprintln!("警告：图标嵌入失败：{e}");
    }
}

#[cfg(not(windows))]
fn embed_icon() {}

fn main() {
    embed_icon();
    // slint_build::compile(...) 保持原样
    slint_build::compile("src/ui/main.slint").unwrap();
}
