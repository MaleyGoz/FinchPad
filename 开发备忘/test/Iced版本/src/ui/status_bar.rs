//! 底部状态栏。

use crate::app::Message;
use crate::model::tab::Tab;
use crate::ui::{TEXT_DIRTY, TEXT_SECONDARY, UI_BG};
use iced::widget::{Space, container, row, text};
use iced::{Alignment, Background, Color, Element, Length};

pub fn view(tab: &Tab, zoom: u32) -> Element<'_, Message> {
    let badge: Element<'_, Message> = if tab.is_dirty {
        text("● 未保存").color(TEXT_DIRTY).size(12).into()
    } else {
        text("").size(12).into()
    };

    let stats = text(format!(
        "共 {} 行 · {} 字符",
        tab.line_count, tab.char_count
    ))
    .color(TEXT_SECONDARY)
    .size(12);

    let encoding = text(tab.encoding.name()).color(TEXT_SECONDARY).size(12);
    let line_ending = text(tab.line_ending.name()).color(TEXT_SECONDARY).size(12);
    let zoom_text = text(format!("{}%", zoom)).color(TEXT_SECONDARY).size(12);
    let separator = || text("·").color(TEXT_SECONDARY).size(12);

    let content = row![
        badge,
        stats,
        Space::new().width(Length::Fill),
        encoding,
        separator(),
        line_ending,
        separator(),
        zoom_text,
    ]
    .spacing(8)
    .align_y(Alignment::Center);

    container(content)
        .padding([8, 12])
        .width(Length::Fill)
        .style(|_theme| container::Style {
            background: Some(Background::Color(UI_BG)),
            ..Default::default()
        })
        .into()
}
