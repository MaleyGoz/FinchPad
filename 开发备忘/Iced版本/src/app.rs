use crate::io::file;
use crate::model::buffer::TextBuffer;
use crate::model::tab::count_text;
use crate::model::workspace::{SaveOutcome, Workspace};
use crate::ui;
use iced::keyboard;
use iced::widget::column;
use iced::{Element, Font, Task};
use iced_code_editor::{CodeEditor, Message as EditorMessage};
use std::path::Path;

/// 100% 缩放时编辑器的字号。
const BASE_FONT_SIZE: f32 = 16.0;
const MIN_ZOOM: u32 = 50;
const MAX_ZOOM: u32 = 400;
const ZOOM_STEP: u32 = 10;

pub struct EditorApp {
    pub workspace: Workspace,
    pub zoom: u32,
    editor: CodeEditor,
    editor_font: Font,
    pending_close: Option<usize>,
    hovered_tab: Option<usize>,
}

#[derive(Debug, Clone)]
pub enum Message {
    EditorEvent(EditorMessage),
    OpenFileRequested,
    SaveRequested,
    SaveAsRequested,
    NewTab,
    TabClicked(usize),
    TabCloseRequested(usize),
    TabHoverEnter(usize),
    TabHoverExit(usize),
    CloseActiveTab,
    CloseDialogSave,
    CloseDialogDiscard,
    CloseDialogCancel,
    ZoomIn,
    ZoomOut,
    ZoomReset,
}

impl EditorApp {
    pub fn new() -> Self {
        let workspace = Workspace::new();

        let editor_font = Font {
            family: iced::font::Family::Name("Sarasa Mono SC"),
            ..Font::DEFAULT
        };

        let mut app = Self {
            workspace,
            zoom: 100,
            editor: CodeEditor::new("", "text"), // 占位，rebuild 会替换
            editor_font,
            pending_close: None,
            hovered_tab: None,
        };
        app.rebuild_editor();
        app
    }

    pub fn title(&self) -> String {
        "TXT Editor".to_string()
    }

    pub fn subscription(&self) -> iced::Subscription<Message> {
        iced::event::listen_with(|event, _status, _id| {
            if let iced::Event::Keyboard(keyboard::Event::KeyPressed { key, modifiers, .. }) = event
            {
                if modifiers.control() {
                    if let keyboard::Key::Character(s) = &key {
                        match s.as_ref() {
                            "s" | "S" => {
                                return Some(if modifiers.shift() {
                                    Message::SaveAsRequested
                                } else {
                                    Message::SaveRequested
                                });
                            }
                            "o" | "O" => return Some(Message::OpenFileRequested),
                            "n" | "N" => return Some(Message::NewTab),
                            "w" | "W" => return Some(Message::CloseActiveTab),
                            "=" | "+" => return Some(Message::ZoomIn),
                            "-" => return Some(Message::ZoomOut),
                            "0" => return Some(Message::ZoomReset),
                            _ => {}
                        }
                    }
                }
            }
            None
        })
    }

    /// 根据当前激活标签 + 当前缩放重建 CodeEditor。
    fn rebuild_editor(&mut self) {
        let tab = self.workspace.active_tab();
        let text = tab.buffer.to_string();
        let syntax = syntax_for_path(tab.file_path.as_deref());
        let font_size = self.zoom as f32 * BASE_FONT_SIZE / 100.0;

        let mut editor = CodeEditor::new(&text, syntax);
        editor.set_theme(ui::editor_theme());
        editor.set_font(self.editor_font);
        editor.set_font_size(font_size, true);
        editor.set_line_numbers_enabled(false);
        editor.set_folding_enabled(false);
        self.editor = editor;
    }

    fn do_save(&mut self) {
        let idx = self.workspace.active_index();
        if self.workspace.save_tab_needs_dialog(idx) {
            self.do_save_as();
            return;
        }
        match self.workspace.save_active_to_disk() {
            Ok(SaveOutcome::Saved) => println!("保存成功"),
            Ok(SaveOutcome::Conflict(change)) => eprintln!("保存冲突：{change:?}"),
            Err(error) => eprintln!("保存失败：{error}"),
        }
    }

    fn do_save_as(&mut self) {
        let idx = self.workspace.active_index();
        let default_name = self.workspace.save_default_name(idx);
        let Some(path) = file::pick_save_path(&default_name) else {
            return;
        };
        match self.workspace.save_active_as(path) {
            Ok(()) => println!("另存为成功"),
            Err(error) => eprintln!("另存为失败：{error}"),
        }
    }

    /// 关闭请求的统一入口：脏标签弹对话框，干净标签直接关。
    fn handle_close_request(&mut self, index: usize) -> Task<Message> {
        if !self.workspace.is_valid_index(index) {
            return Task::none();
        }
        if self.workspace.tab_needs_close_confirmation(index) {
            self.pending_close = Some(index);
        } else {
            self.workspace.close_tab(index);
            self.rebuild_editor();
        }
        Task::none()
    }

    pub fn update(&mut self, message: Message) -> Task<Message> {
        match message {
            Message::EditorEvent(event) => {
                let task = self.editor.update(&event).map(Message::EditorEvent);

                let text = self.editor.content();
                let tab = self.workspace.active_tab_mut();
                let current = tab.buffer.to_string();

                if text != current {
                    tab.buffer = TextBuffer::from_str(&text);
                    tab.mark_dirty();
                    let (lines, chars) = count_text(&text);
                    tab.line_count = lines;
                    tab.char_count = chars;
                }

                task
            }

            Message::OpenFileRequested => {
                let paths = file::pick_open_paths();
                if paths.is_empty() {
                    return Task::none();
                }
                for path in paths {
                    match file::read_file(&path) {
                        Ok((content, encoding, line_ending, mtime)) => {
                            self.workspace
                                .open_file(path, &content, encoding, line_ending, mtime);
                        }
                        Err(error) => eprintln!("打开文件失败：{error}"),
                    }
                }
                self.rebuild_editor();
                Task::none()
            }

            Message::SaveRequested => {
                self.do_save();
                Task::none()
            }

            Message::SaveAsRequested => {
                self.do_save_as();
                Task::none()
            }

            Message::NewTab => {
                self.workspace.new_tab();
                self.rebuild_editor();
                Task::none()
            }

            Message::TabClicked(i) => {
                if i == self.workspace.active_index() {
                    return Task::none();
                }
                self.workspace.switch_to(i);
                self.rebuild_editor();
                Task::none()
            }

            Message::TabCloseRequested(i) => self.handle_close_request(i),

            Message::TabHoverEnter(i) => {
                self.hovered_tab = Some(i);
                Task::none()
            }

            Message::TabHoverExit(i) => {
                // 只有当前悬停的还是 i 时才清除，避免快速滑动时的抖动
                if self.hovered_tab == Some(i) {
                    self.hovered_tab = None;
                }
                Task::none()
            }

            Message::CloseActiveTab => {
                let active = self.workspace.active_index();
                self.handle_close_request(active)
            }

            Message::CloseDialogSave => {
                let Some(i) = self.pending_close.take() else {
                    return Task::none();
                };
                if !self.workspace.is_valid_index(i) {
                    return Task::none();
                }

                let needs_save_as = self.workspace.save_tab_needs_dialog(i);
                if needs_save_as {
                    let default_name = self.workspace.save_default_name(i);
                    let Some(path) = file::pick_save_path(&default_name) else {
                        return Task::none();
                    };
                    if let Err(e) = self.workspace.save_tab_as(i, path) {
                        eprintln!("保存失败：{e}");
                        return Task::none();
                    }
                } else {
                    match self.workspace.save_tab_to_disk(i) {
                        Ok(SaveOutcome::Saved) => {}
                        Ok(SaveOutcome::Conflict(change)) => {
                            eprintln!("保存冲突：{change:?}");
                            return Task::none();
                        }
                        Err(e) => {
                            eprintln!("保存失败：{e}");
                            return Task::none();
                        }
                    }
                }

                self.workspace.close_tab(i);
                self.rebuild_editor();
                Task::none()
            }

            Message::CloseDialogDiscard => {
                if let Some(i) = self.pending_close.take() {
                    self.workspace.close_tab(i);
                    self.rebuild_editor();
                }
                Task::none()
            }

            Message::CloseDialogCancel => {
                self.pending_close = None;
                Task::none()
            }

            Message::ZoomIn => {
                let new = (self.zoom + ZOOM_STEP).min(MAX_ZOOM);
                if new != self.zoom {
                    self.zoom = new;
                    self.rebuild_editor();
                }
                Task::none()
            }

            Message::ZoomOut => {
                let new = self.zoom.saturating_sub(ZOOM_STEP).max(MIN_ZOOM);
                if new != self.zoom {
                    self.zoom = new;
                    self.rebuild_editor();
                }
                Task::none()
            }

            Message::ZoomReset => {
                if self.zoom != 100 {
                    self.zoom = 100;
                    self.rebuild_editor();
                }
                Task::none()
            }
        }
    }

    pub fn view(&self) -> Element<'_, Message> {
        let main_ui: Element<'_, Message> = column![
            ui::tab_bar::view(&self.workspace, self.hovered_tab),
            ui::editor_view::view(&self.editor),
            ui::status_bar::view(self.workspace.active_tab(), self.zoom),
        ]
        .spacing(0)
        .into();

        if let Some(i) = self.pending_close {
            let filename = self
                .workspace
                .tab_title(i)
                .unwrap_or_else(|| "未命名".to_string());
            ui::dialog::save_confirm(main_ui, filename)
        } else {
            main_ui
        }
    }
}

impl Default for EditorApp {
    fn default() -> Self {
        Self::new()
    }
}

fn syntax_for_path(path: Option<&Path>) -> &'static str {
    let Some(path) = path else { return "text" };
    match path.extension().and_then(|e| e.to_str()) {
        Some("rs") => "rs",
        Some("py") => "py",
        Some("js") | Some("mjs") => "js",
        Some("ts") => "ts",
        Some("json") => "json",
        Some("toml") => "toml",
        Some("yaml") | Some("yml") => "yaml",
        Some("html") | Some("htm") => "html",
        Some("css") => "css",
        Some("md") => "md",
        Some("c") | Some("h") => "c",
        Some("cpp") | Some("cc") | Some("cxx") => "cpp",
        Some("go") => "go",
        Some("sh") => "sh",
        _ => "text",
    }
}
