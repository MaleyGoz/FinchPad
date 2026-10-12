import { writable } from "svelte/store";

export type TooltipState = {
  visible: boolean;
  text: string;
  x: number;
  y: number;
  placeAbove: boolean;
};

export const tooltipStore = writable<TooltipState>({
  visible: false,
  text: "",
  x: 0,
  y: 0,
  placeAbove: false,
});

/** 显示 tooltip，锚定到某个元素的左下角（或左上角，视空间） */
export function showTooltip(text: string, anchorEl: HTMLElement) {
  if (!text) return;
  const rect = anchorEl.getBoundingClientRect();
  const winH = window.innerHeight;
  const estimatedHeight = 60;
  const belowSpace = winH - rect.bottom;
  const placeAbove = belowSpace < estimatedHeight + 10;

  tooltipStore.set({
    visible: true,
    text,
    x: rect.left,
    y: placeAbove ? rect.top - 4 : rect.bottom + 4,
    placeAbove,
  });
}

export function hideTooltip() {
  tooltipStore.update((s) => ({ ...s, visible: false }));
}

/** Svelte action：`<div use:tooltip={text}>...</div>` */
export function tooltip(node: HTMLElement, text: string | undefined) {
  let currentText = text ?? "";
  let timer: ReturnType<typeof setTimeout> | null = null;

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function onEnter() {
    if (!currentText) return;
    clearTimer();
    timer = setTimeout(() => {
      showTooltip(currentText, node);
      timer = null;
    }, 500);
  }

  function onLeave() {
    clearTimer();
    hideTooltip();
  }

  node.addEventListener("mouseenter", onEnter);
  node.addEventListener("mouseleave", onLeave);

  return {
    update(newText: string | undefined) {
      currentText = newText ?? "";
    },
    destroy() {
      clearTimer();
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mouseleave", onLeave);
    },
  };
}
