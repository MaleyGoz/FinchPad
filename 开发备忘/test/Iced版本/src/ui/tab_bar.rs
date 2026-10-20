//! 顶部标签栏。

use crate::app::Message;
use crate::model::workspace::Workspace;
use crate::ui::{TAB_ACTIVE_BG, TAB_HOVER_BG, TEXT_PRIMARY, TEXT_SECONDARY, UI_BG};
use iced::border::{Border, Radius};
use iced::widget::{Space, container, mouse_area, row, text};
use iced::{Alignment, Background, Color, Element, Length};

/// 圆点 / × 指示区固定宽度，避免标签宽度抖动
const INDICATOR_WIDTH: f32 = 24.0;

pub fn view(workspace: &Workspace, hovered: Option<usize>) -> Element<'_, Message> {
    let mut bar = row![].spacing(1).padding([6, 8]);
    let active = workspace.active_index();

    for (i, tab) in workspace.tabs().iter().enumerate() {
        let is_active = i == active;
        let is_hovered = hovered == Some(i);

        let label = text(tab.title.clone()).size(13).color(if is_active {
            TEXT_PRIMARY
        } else {
            TEXT_SECONDARY
        });

        // 指示区策略：
        //   悬停 → ×；否则脏 → ●；否则激活 → ×；否则空
        let indicator: Element<'static, Message> = if is_hovered {
            close_button(i)
        } else if tab.is_dirty {
            dot_indicator()
        } else if is_active {
            close_button(i)
        } else {
            Space::new().width(INDICATOR_WIDTH).into()
        };

        let content = container(
            row![label, indicator]
                .spacing(4)
                .align_y(Alignment::Center)
                .padding([6, 10]),
        )
        .width(Length::Fixed(150.0))
        .style(tab_style(is_active, is_hovered));

        let tab_item = mouse_area(content)
            .on_enter(Message::TabHoverEnter(i))
            .on_exit(Message::TabHoverExit(i))
            .on_press(Message::TabClicked(i));

        bar = bar.push(tab_item);
    }

    // 新建标签 "+"
    bar = bar.push(
        mouse_area(container(text("+").size(15).color(TEXT_SECONDARY)).padding([6, 10]))
            .on_press(Message::NewTab),
    );

    bar = bar.push(Space::new().width(Length::Fill));

    container(bar)
        .width(Length::Fill)
        .style(|_theme| container::Style {
            background: Some(Background::Color(UI_BG)),
            ..Default::default()
        })
        .into()
}

fn close_button(i: usize) -> Element<'static, Message> {
    mouse_area(
        container(text("×").size(14).color(TEXT_SECONDARY))
            .width(Length::Fixed(INDICATOR_WIDTH))
            .height(Length::Fixed(INDICATOR_WIDTH))
            .center_x(Length::Fixed(INDICATOR_WIDTH))
            .center_y(Length::Fixed(INDICATOR_WIDTH)),
    )
    .on_press(Message::TabCloseRequested(i))
    .into()
}

fn dot_indicator() -> Element<'static, Message> {
    container(text("●").size(11).color(Color::from_rgb(0.62, 0.66, 0.72)))
        .width(Length::Fixed(INDICATOR_WIDTH))
        .height(Length::Fixed(INDICATOR_WIDTH))
        .center_x(Length::Fixed(INDICATOR_WIDTH))
        .center_y(Length::Fixed(INDICATOR_WIDTH))
        .into()
}

fn tab_style(is_active: bool, is_hovered: bool) -> impl Fn(&iced::Theme) -> container::Style {
    move |_theme| {
        let bg = if is_active {
            TAB_ACTIVE_BG
        } else if is_hovered {
            TAB_HOVER_BG
        } else {
            Color::TRANSPARENT
        };
        container::Style {
            background: Some(Background::Color(bg)),
            border: Border {
                color: Color::TRANSPARENT,
                width: 0.0,
                radius: Radius {
                    top_left: 6.0,
                    top_right: 6.0,
                    bottom_left: 0.0,
                    bottom_right: 0.0,
                },
            },
            ..Default::default()
        }
    }
}
