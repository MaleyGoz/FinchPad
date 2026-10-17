//! 中部编辑区。

use crate::app::Message;
use iced::widget::container;
use iced::{Background, Color, Element, Length};
use iced_code_editor::CodeEditor;

pub fn view(editor: &CodeEditor) -> Element<'_, Message> {
    container(editor.view().map(Message::EditorEvent))
        .padding(0)
        .width(Length::Fill)
        .height(Length::Fill)
        .style(|_theme| container::Style {
            background: Some(Background::Color(Color::WHITE)),
            ..Default::default()
        })
        .into()
}
