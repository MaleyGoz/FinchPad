mod app;
mod io;
mod model;
mod ui;

use app::EditorApp;
use iced::Font;
use std::borrow::Cow;

fn main() -> iced::Result {
    let chinese_font: Cow<'static, [u8]> =
        Cow::Borrowed(include_bytes!("../assets/fonts/SarasaMonoSC-Regular.ttf"));

    let default_font = Font {
        family: iced::font::Family::Name("Sarasa Mono SC"),
        ..Font::DEFAULT
    };

    iced::application(EditorApp::new, EditorApp::update, EditorApp::view)
        .title(EditorApp::title)
        .subscription(EditorApp::subscription)
        .font(chinese_font)
        .default_font(default_font)
        .run()
}
