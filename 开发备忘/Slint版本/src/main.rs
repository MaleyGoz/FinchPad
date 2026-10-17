mod app;
mod io;
mod model;
mod ui;

slint::include_modules!();

use app::App;
use std::rc::Rc;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let window = MainWindow::new()?;
    let tooltip_window = Rc::new(TooltipWindow::new()?);
    let _ = tooltip_window.hide();

    let app = Rc::new(App::new(tooltip_window));
    app.bind(&window);

    // 先尝试恢复上次会话（可能覆盖默认的空白标签）
    app.restore_session(&window);

    // 再同步 UI（恢复后的 workspace → Slint 属性）
    app.sync_ui(&window);

    window.run()?;

    // 窗口关闭后：保存本次会话
    app.save_session_on_exit(&window);
    Ok(())
}
