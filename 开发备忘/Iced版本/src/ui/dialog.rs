//! 对话框组件。
//!
//! 未来会包含：
//!   - 关闭脏标签的保存确认框（已实现）
//!   - 外部冲突完整对话框
//!   - 轻量冲突对话框

use crate::app::Message;
use crate::ui::{BORDER_COLOR, TEXT_PRIMARY};
use iced::border::{Border, Radius};
use iced::widget::{Space, button, column, container, row, stack, text};
use iced::{Alignment, Background, Color, Element, Length};

/// 关闭脏标签时的"保存确认"对话框。
/// 把 `background`（主界面）和遮罩 + 卡片叠加成 `stack`。
pub fn save_confirm<'a>(
    background: Element<'a, Message>,
    filename: String,
) -> Element<'a, Message> {
    let message = text(format!("是否保存对「{}」的修改？", filename))
        .size(14)
        .color(TEXT_PRIMARY);

    let buttons = row![
        Space::new().width(Length::Fill),
        button("保存")
            .padding([6, 16])
            .on_press(Message::CloseDialogSave),
        button("不保存")
            .padding([6, 16])
            .on_press(Message::CloseDialogDiscard),
        button("取消")
            .padding([6, 16])
            .on_press(Message::CloseDialogCancel),
    ]
    .spacing(8)
    .align_y(Alignment::Center);

    let card = container(column![message, buttons].spacing(20))
        .padding(24)
        .width(Length::Fixed(420.0))
        .style(|_theme| container::Style {
            background: Some(Background::Color(Color::WHITE)),
            border: Border {
                color: BORDER_COLOR,
                width: 1.0,
                radius: Radius::from(8.0),
            },
            ..Default::default()
        });

    let overlay = container(card)
        .width(Length::Fill)
        .height(Length::Fill)
        .center_x(Length::Fill)
        .center_y(Length::Fill)
        .style(|_theme| container::Style {
            background: Some(Background::Color(crate::ui::OVERLAY)),
            ..Default::default()
        });

    stack![background, overlay].into()
}
