use arboard::Clipboard;
use std::cell::RefCell;
use std::rc::Rc;

use editor_core::{Command, CursorCommand, EditCommand, EditorStateManager, Position};

slint::include_modules!();

fn position_to_offset(editor: &EditorStateManager, position: Position) -> usize {
    let text = editor.editor().get_text();

    let mut offset = 0;

    for (line_index, line) in text.split('\n').enumerate() {
        if line_index == position.line {
            return offset + position.column.min(line.chars().count());
        }

        offset += line.chars().count() + 1;
    }

    offset
}

fn offset_to_position(text: &str, offset: usize) -> Position {
    let mut current_offset = 0;

    for (line, line_text) in text.split('\n').enumerate() {
        let line_len = line_text.chars().count();

        if offset <= current_offset + line_len {
            return Position::new(line, offset.saturating_sub(current_offset));
        }

        current_offset += line_len + 1;
    }

    let last_line = text.split('\n').count().saturating_sub(1);

    Position::new(
        last_line,
        text.split('\n').last().unwrap_or("").chars().count(),
    )
}

fn insert_visual_selection(
    display: &mut String,
    text: &str,
    selection_start: usize,
    selection_end: usize,
    cursor_offset: usize,
) {
    let start = selection_start.min(selection_end);
    let end = selection_start.max(selection_end);

    let chars: Vec<char> = text.chars().collect();

    for index in 0..=chars.len() {
        if index == start && start != end {
            display.push('[');
        }

        if index == cursor_offset {
            display.push('|');
        }

        if index == end && start != end {
            display.push(']');
        }

        if index < chars.len() {
            display.push(chars[index]);
        }
    }
}

fn refresh_ui(ui: &App, editor: &EditorStateManager, status: &str) {
    let text = editor.editor().get_text();
    let cursor = editor.editor().cursor_position();

    let cursor_offset = position_to_offset(editor, cursor);

    let mut display = String::new();

    if let Some(selection) = editor.editor().selection() {
        let start_offset = position_to_offset(editor, selection.start);

        let end_offset = position_to_offset(editor, selection.end);

        insert_visual_selection(&mut display, &text, start_offset, end_offset, cursor_offset);

        let selected_text: String = text
            .chars()
            .skip(start_offset.min(end_offset))
            .take(
                end_offset
                    .max(start_offset)
                    .saturating_sub(start_offset.min(end_offset)),
            )
            .collect();

        ui.set_selection_info(
            format!(
                "Selection: {} chars — {:?}",
                selected_text.chars().count(),
                selected_text
            )
            .into(),
        );
    } else {
        let chars: Vec<char> = text.chars().collect();

        for index in 0..=chars.len() {
            if index == cursor_offset {
                display.push('|');
            }

            if index < chars.len() {
                display.push(chars[index]);
            }
        }

        ui.set_selection_info("Selection: none".into());
    }

    ui.set_display_text(display.into());

    ui.set_cursor_info(
        format!(
            "Cursor: line {}, column {}",
            cursor.line + 1,
            cursor.column + 1
        )
        .into(),
    );

    ui.set_status_text(status.into());
}

fn move_and_extend_selection(editor: &mut EditorStateManager, command: CursorCommand) {
    let current_cursor = editor.editor().cursor_position();

    let selection = editor.editor().selection().cloned();

    // If there is no existing selection, the current
    // cursor becomes the anchor.
    let anchor = match selection {
        Some(selection) => {
            // Preserve the original anchor.
            if selection.direction == editor_core::SelectionDirection::Forward {
                selection.start
            } else {
                selection.end
            }
        }

        None => current_cursor,
    };

    // First move the cursor normally.
    editor
        .execute(Command::Cursor(command))
        .expect("cursor movement failed");

    let new_cursor = editor.editor().cursor_position();

    editor
        .execute(Command::Cursor(CursorCommand::SetSelection {
            start: anchor,
            end: new_cursor,
        }))
        .expect("selection update failed");
}

fn get_selected_text(manager: &EditorStateManager) -> Option<String> {
    let selection = manager.get_cursor_state().selection?;

    if selection.start == selection.end {
        return None;
    }

    let (start, end) = if selection.start <= selection.end {
        (selection.start, selection.end)
    } else {
        (selection.end, selection.start)
    };

    let start_offset = manager
        .editor()
        .line_index()
        .position_to_char_offset(start.line, start.column);

    let end_offset = manager
        .editor()
        .line_index()
        .position_to_char_offset(end.line, end.column);

    let text = manager.editor().get_text();

    Some(
        text.chars()
            .skip(start_offset)
            .take(end_offset.saturating_sub(start_offset))
            .collect(),
    )
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ui = App::new()?;

    let editor = Rc::new(RefCell::new(EditorStateManager::new("", 80)));

    // ------------------------------------------------------------
    // Normal text input
    // ------------------------------------------------------------

    {
        let editor = Rc::clone(&editor);
        let weak_ui = ui.as_weak();

        ui.on_insert_text(move |text| {
            let Some(ui) = weak_ui.upgrade() else {
                return;
            };

            let mut editor = editor.borrow_mut();

            editor
                .execute(Command::Edit(EditCommand::InsertText {
                    text: text.to_string(),
                }))
                .expect("InsertText failed");

            refresh_ui(&ui, &editor, &format!("Insert: {:?}", text));
        });
    }

    // ------------------------------------------------------------
    // Commands
    // ------------------------------------------------------------

    {
        let editor = Rc::clone(&editor);
        let weak_ui = ui.as_weak();

        ui.on_command(move |command| {
            let Some(ui) = weak_ui.upgrade() else {
                return;
            };

            let mut editor = editor.borrow_mut();

            let status = match command.as_str() {
                "copy" => {
                    if let Some(text) = get_selected_text(&manager) {
                        match Clipboard::new() {
                            Ok(mut clipboard) => {
                                match clipboard.set_text(text) {
                                    Ok(()) => {
                                        // 复制成功
                                    }
                                    Err(error) => {
                                        eprintln!("Copy failed: {error}");
                                    }
                                }
                            }
                            Err(error) => {
                                eprintln!("Clipboard unavailable: {error}");
                            }
                        }
                    }
                }

                "cut" => {
                    if let Some(text) = get_selected_text(&manager) {
                        match Clipboard::new() {
                            Ok(mut clipboard) => {
                                if let Err(error) = clipboard.set_text(text) {
                                    eprintln!("Cut failed: {error}");
                                } else {
                                    // Backspace 会删除当前 selection
                                    if let Err(error) =
                                        manager.execute(Command::Edit(EditCommand::Backspace))
                                    {
                                        eprintln!("Cut delete failed: {error}");
                                    }
                                }
                            }
                            Err(error) => {
                                eprintln!("Clipboard unavailable: {error}");
                            }
                        }
                    }
                }

                "paste" => match Clipboard::new() {
                    Ok(mut clipboard) => match clipboard.get_text() {
                        Ok(text) => {
                            if let Err(error) =
                                manager.execute(Command::Edit(EditCommand::InsertText { text }))
                            {
                                eprintln!("Paste failed: {error}");
                            }
                        }
                        Err(error) => {
                            eprintln!("Clipboard does not contain text: {error}");
                        }
                    },
                    Err(error) => {
                        eprintln!("Clipboard unavailable: {error}");
                    }
                },
                // =================================================
                // Selection
                // =================================================
                "shift-left" => {
                    move_and_extend_selection(&mut editor, CursorCommand::MoveGraphemeLeft);

                    "Shift + Left"
                }

                "shift-right" => {
                    move_and_extend_selection(&mut editor, CursorCommand::MoveGraphemeRight);

                    "Shift + Right"
                }

                "shift-up" => {
                    move_and_extend_selection(
                        &mut editor,
                        CursorCommand::MoveVisualBy { delta_rows: -1 },
                    );

                    "Shift + Up"
                }

                "shift-down" => {
                    move_and_extend_selection(
                        &mut editor,
                        CursorCommand::MoveVisualBy { delta_rows: 1 },
                    );

                    "Shift + Down"
                }

                "shift-home" => {
                    move_and_extend_selection(&mut editor, CursorCommand::MoveToLineStart);

                    "Shift + Home"
                }

                "shift-end" => {
                    move_and_extend_selection(&mut editor, CursorCommand::MoveToLineEnd);

                    "Shift + End"
                }

                "select-all" => {
                    let text = editor.editor().get_text();

                    let end = offset_to_position(&text, text.chars().count());

                    editor
                        .execute(Command::Cursor(CursorCommand::SetSelection {
                            start: Position::new(0, 0),
                            end,
                        }))
                        .expect("Select all failed");

                    "Ctrl + A"
                }

                // =================================================
                // Normal cursor movement
                // =================================================
                "left" => {
                    editor
                        .execute(Command::Cursor(CursorCommand::MoveGraphemeLeft))
                        .expect("Left failed");

                    "Left"
                }

                "right" => {
                    editor
                        .execute(Command::Cursor(CursorCommand::MoveGraphemeRight))
                        .expect("Right failed");

                    "Right"
                }

                "up" => {
                    editor
                        .execute(Command::Cursor(CursorCommand::MoveVisualBy {
                            delta_rows: -1,
                        }))
                        .expect("Up failed");

                    "Up"
                }

                "down" => {
                    editor
                        .execute(Command::Cursor(CursorCommand::MoveVisualBy {
                            delta_rows: 1,
                        }))
                        .expect("Down failed");

                    "Down"
                }

                "home" => {
                    editor
                        .execute(Command::Cursor(CursorCommand::MoveToLineStart))
                        .expect("Home failed");

                    "Home"
                }

                "end" => {
                    editor
                        .execute(Command::Cursor(CursorCommand::MoveToLineEnd))
                        .expect("End failed");

                    "End"
                }

                // =================================================
                // Editing
                // =================================================
                "backspace" => {
                    editor
                        .execute(Command::Edit(EditCommand::Backspace))
                        .expect("Backspace failed");

                    "Backspace"
                }

                "enter" => {
                    editor
                        .execute(Command::Edit(EditCommand::InsertNewline {
                            auto_indent: false,
                        }))
                        .expect("Enter failed");

                    "Enter"
                }

                "tab" => {
                    editor
                        .execute(Command::Edit(EditCommand::InsertTab))
                        .expect("Tab failed");

                    "Tab"
                }

                _ => "Unknown",
            };

            refresh_ui(&ui, &editor, status);
        });
    }

    // ------------------------------------------------------------
    // Initial state
    // ------------------------------------------------------------

    {
        let editor = editor.borrow();

        refresh_ui(&ui, &editor, "Ready — type something");
    }

    ui.run()?;

    Ok(())
}
