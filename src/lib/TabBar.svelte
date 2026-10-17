<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { tooltip } from '$lib/tooltip';
  import { getCurrentWindow } from '@tauri-apps/api/window';
  export let titles: string[];
  export let activeIndex: number;
  export let dirtyStates: boolean[] = [];
  export let paths: string[] = [];
  export let onSelect: (index: number) => void;
  export let onClose: (index: number) => void;
  export let onNew: () => void;
  export let onContextMenu: (index: number, x: number, y: number) => void = () => {};
  export let onReorder: (from: number, to: number) => void = () => {};
  export let onBarContextMenu: (x: number, y: number) => void = () => {};
  export let onSettingsClick: (anchorRight: number, anchorBottom: number) => void = () => {};

    // 编译时注入的环境变量
  const platform = import.meta.env.TAURI_ENV_PLATFORM;
  const isMac = platform === 'macos';

//重命名开始
  export let renamingIndex: number = -1;
  export let onRenameCommit: (index: number, newName: string) => void = () => {};
  export let onRenameCancel: () => void = () => {};

  let renameValue = '';
  let isCancellingRename = false;
  let lastRenamingIndex = -1;
  let renameInputEl: HTMLInputElement; // ★ 新增：直接绑定 DOM 元素

  $: if (renamingIndex !== lastRenamingIndex) {
    lastRenamingIndex = renamingIndex;
    if (renamingIndex >= 0 && titles[renamingIndex]) {
      renameValue = titles[renamingIndex];
      
      // 使用 tick() 代替 setTimeout，确保 DOM 已渲染
      tick().then(() => {
        if (renameInputEl) {
          renameInputEl.focus();
          const dotIdx = renameInputEl.value.lastIndexOf('.');
          if (dotIdx > 0) renameInputEl.setSelectionRange(0, dotIdx);
          else renameInputEl.select();
        }
      });
    } else {
      renameValue = '';
    }
  }

  function handleRenameKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      isCancellingRename = true;
      (e.target as HTMLInputElement).blur();
    }
  }

  function handleRenameBlur() {
    if (isCancellingRename) {
      isCancellingRename = false;
      onRenameCancel();
      return;
    }
    
    let newName = renameValue.trim().replace(/[\\/:*?"<>|]/g, '');
    if (!newName || (renamingIndex >= 0 && newName === titles[renamingIndex])) {
      onRenameCancel();
      return;
    }
    onRenameCommit(renamingIndex, newName);
  }
// 重命名结束

  const MIN_TAB_W = 100;
  const MAX_TAB_W = 200;
  const ADD_BTN_W = 32;          // + 新建
  const DD_BTN_W = 32;           // ▼ 下拉
  const SETTINGS_BTN_W = 32;     // ⚙ 设置
  const WINDOW_BTNS_W = 46 * 3;  // ─ □ × 三个窗口按钮
  const LOGO_W = 38;
  const MIN_BLANK = 100;         // 拖动区最小宽度（从 80 加大）
  const GAP = 1;
  const FIXED_WIDTH = ADD_BTN_W + SETTINGS_BTN_W + WINDOW_BTNS_W;

  // 标签宽度计算的固定开销（不含文字）
  const TAB_FONT = '13px system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';  // 与 .tab 的 font-size 一致
  const TAB_PADDING_L = 10;            // .tab 的 padding-left
  const TAB_PADDING_R = 5;             // .tab 的 padding-right
  const CLOSE_BTN_W = 24;              // 关闭按钮 × / 脏标记 ● 的预留宽度
  const TAB_BORDER_W = 1;              // .tab 的 border-right

  // canvas 用于测量文字实际渲染宽度
  let measureCanvas: HTMLCanvasElement | null = null;
  let measureCtx: CanvasRenderingContext2D | null = null;

  function measureTextWidth(text: string): number {
    if (typeof document === 'undefined') return text.length * 8;
    if (!measureCtx) {
      measureCanvas = document.createElement('canvas');
      measureCtx = measureCanvas.getContext('2d');
    }
    if (!measureCtx) return text.length * 8;
    measureCtx.font = TAB_FONT;
    return measureCtx.measureText(text).width;
  }


  let tabBarEl: HTMLDivElement;
  let containerWidth = 0;
  let resizeObserver: ResizeObserver | null = null;

  let visibleStart = 0;
  let visibleCount = 0;
  let tabWidth = MAX_TAB_W;
  let hasOverflow = false;

  let hoveredIndex = -1;
  // 窗口状态
  let isMaximized = false;
  const appWindow = getCurrentWindow();

  async function handleMinimize() {
    await appWindow.minimize();
  }
  async function handleToggleMaximize() {
    await appWindow.toggleMaximize();
    isMaximized = await appWindow.isMaximized();
  }
  async function handleClose() {
    await appWindow.close();
  }  

  let dragFromIndex = -1;
  let dragToIndex = -1;
  let dragStartX = 0;
  let dragCurrentX = 0;
  let isDragging = false;
  let suppressClickUntil = 0;
  let tabCenters: number[] = [];

  let dropdownOpen = false;
  let dropdownLeft = 0;
  let dropdownTop = 0;
  let dropdownButtonEl: HTMLButtonElement | undefined;
  let dropdownMenuEl: HTMLDivElement | undefined;

  $: totalCount = titles.length;
  $: visibleEnd = visibleStart + visibleCount;
  $: hiddenIndices = Array.from({ length: totalCount }, (_, i) => i).filter(
    (i) => i < visibleStart || i >= visibleEnd
  );

  // ============ 布局计算 ============
  $: {
    const width = containerWidth;
    const count = totalCount;

    if (width <= 0 || count === 0) {
      visibleCount = count;
      tabWidth = MAX_TAB_W;
      hasOverflow = false;
    } else {
      // 无 ▼ 时可用于标签区的宽度（扣掉所有固定按钮 + 拖动区最小值）
      const avail = width - FIXED_WIDTH - MIN_BLANK;
      const idealNoDD = (avail - GAP * count) / count;

      if (idealNoDD > MAX_TAB_W) {
        // 空间充足 → 按最长标签名算宽度
        const maxTextW = Math.max(
          ...titles.map((t) => measureTextWidth(t)),
          MIN_TAB_W - TAB_PADDING_L - TAB_PADDING_R - CLOSE_BTN_W - TAB_BORDER_W
        );
        const neededW =
          maxTextW + TAB_PADDING_L + TAB_PADDING_R + CLOSE_BTN_W + TAB_BORDER_W;
        tabWidth = Math.max(MIN_TAB_W, Math.min(MAX_TAB_W, neededW));
        visibleCount = count;
        hasOverflow = false;
      } else if (idealNoDD >= MIN_TAB_W+5) {
        // 刚好能放下所有标签（自动压缩）
        tabWidth = idealNoDD;
        visibleCount = count;
        hasOverflow = false;
      } else {
        // 必须溢出 → 加 ▼
        hasOverflow = true;
        const availWithDD = avail - DD_BTN_W;
        // 计算最多能显示多少个 80px 标签
        const maxVisible = Math.max(
          1,
          Math.floor((availWithDD - GAP * (count + 1)) / (MIN_TAB_W + GAP))
        );
        visibleCount = maxVisible;
        // 让可见标签宽度自适应填满剩余空间
        const selfAdapt = (availWithDD - GAP * (visibleCount + 1)) / visibleCount;
        tabWidth = Math.max(MIN_TAB_W, Math.min(MAX_TAB_W, selfAdapt));
      }
    }

    const maxStart = Math.max(0, count - visibleCount);
    if (visibleStart > maxStart) visibleStart = maxStart;
  }

  // ============ activeIndex 变化时，自动滚动到可见区 ============
  $: {
    const idx = activeIndex;
    const vc = visibleCount;
    const tc = totalCount;
    if (idx >= 0 && vc > 0 && tc > 0) {
      const maxStart = Math.max(0, tc - vc);
      let newStart = visibleStart;
      if (idx < visibleStart) {
        newStart = Math.min(idx, maxStart);
      } else if (idx >= visibleStart + vc) {
        newStart = Math.max(0, Math.min(idx - vc + 1, maxStart));
      }
      if (newStart !== visibleStart) {
        visibleStart = newStart;
      }
    }
  }

  // ============ 拖拽 ============
  function collectTabCenters() {
    if (!tabBarEl) return;
    const tabs = tabBarEl.querySelectorAll('.tab');
    tabCenters = Array.from(tabs).map((t) => {
      const r = (t as HTMLElement).getBoundingClientRect();
      return r.left + r.width / 2;
    });
  }

  function calcTargetIndex(x: number): number {
    if (tabCenters.length === 0) return visibleStart;
    let best = 0;
    let bestDist = Infinity;
    for (let k = 0; k < tabCenters.length; k++) {
      const d = Math.abs(tabCenters[k] - x);
      if (d < bestDist) {
        bestDist = d;
        best = k;
      }
    }
    return visibleStart + best;
  }

  function onTabMouseDown(e: MouseEvent, absIdx: number) {
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      onClose(absIdx);
      return;
    }
    if (e.button !== 0) return;
    dragFromIndex = absIdx;
    dragToIndex = absIdx;
    dragStartX = e.clientX;
    dragCurrentX = e.clientX;
    isDragging = false;
    collectTabCenters();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (dragFromIndex < 0) return;
    dragCurrentX = e.clientX;
    if (!isDragging && Math.abs(dragCurrentX - dragStartX) > 5) {
      isDragging = true;
    }
    if (isDragging) {
      dragToIndex = calcTargetIndex(dragCurrentX);
    }
  }

  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    if (
      isDragging &&
      dragFromIndex >= 0 &&
      dragToIndex >= 0 &&
      dragFromIndex !== dragToIndex
    ) {
      suppressClickUntil = Date.now() + 300;
      onReorder(dragFromIndex, dragToIndex);
    }
    dragFromIndex = -1;
    dragToIndex = -1;
    isDragging = false;
  }

  function onTabClick(e: MouseEvent, absIdx: number) {
    if (Date.now() < suppressClickUntil) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    onSelect(absIdx);
  }

  // ============ 下拉菜单 ============
  async function toggleDropdown() {
    if (dropdownOpen) {
      dropdownOpen = false;
      return;
    }
    dropdownOpen = true;
    await tick(); // 等菜单渲染，拿到实际宽度

    if (!dropdownButtonEl || !dropdownMenuEl) return;

    const btnR = dropdownButtonEl.getBoundingClientRect();
    const menuW = dropdownMenuEl.offsetWidth;
    const menuH = dropdownMenuEl.offsetHeight;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const margin = 8;

    // 1. 水平位置：默认右对齐 ▼ 按钮
    let left = btnR.right - menuW;

    // 2. 超出左边界 → 贴左边界
    if (left < margin) {
      left = margin;
    }
    // 3. 超出右边界 → 贴右边界
    if (left + menuW > winW - margin) {
      left = winW - menuW - margin;
    }

    // 4. 垂直位置：默认 ▼ 按钮下方
    let top = btnR.bottom + 2;
    // 5. 下方空间不足 → 向上展开
    if (top + menuH + margin > winH) {
      top = btnR.top - menuH - 2;
      if (top < margin) top = margin;
    }

    dropdownLeft = left;
    dropdownTop = top;
  }

  function selectFromDropdown(absIdx: number) {
    dropdownOpen = false;
    const maxStart = Math.max(0, totalCount - visibleCount);
    visibleStart = Math.max(0, Math.min(absIdx - visibleCount + 1, maxStart));
    onSelect(absIdx);
  }

  // ============ 生命周期 ============
  onMount(() => {
    // 初始窗口状态
    appWindow.isMaximized().then((v) => (isMaximized = v)).catch(console.error);

    // 监听窗口尺寸变化 → 更新最大化状态
    let unlistenResize: (() => void) | null = null;
    appWindow
      .onResized(async () => {
        isMaximized = await appWindow.isMaximized();
      })
      .then((fn) => (unlistenResize = fn))
      .catch(console.error);

    if (tabBarEl) {
      resizeObserver = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width ?? 0;
        if (w !== containerWidth) containerWidth = w;
      });
      resizeObserver.observe(tabBarEl);
      containerWidth = tabBarEl.getBoundingClientRect().width;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownOpen) return;
      const target = e.target as HTMLElement;
      if (target.closest('.dropdown-wrapper')) return;
      dropdownOpen = false;
    };
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (unlistenResize) unlistenResize();  
      resizeObserver?.disconnect();
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  // ============ 拖拽指示线 ============
  $: dragIndicatorX = (() => {
    if (!isDragging || tabCenters.length === 0) return -1;
    const visibleFrom = dragFromIndex - visibleStart;
    const visibleTo = dragToIndex - visibleStart;
    if (visibleFrom < 0 || visibleTo < 0) return -1;
    if (visibleTo === visibleFrom) return -1;
    if (!tabBarEl) return -1;
    const tabs = tabBarEl.querySelectorAll('.tab');
    if (visibleTo >= tabs.length || visibleFrom >= tabs.length) return -1;
    const barR = tabBarEl.getBoundingClientRect();
    if (visibleTo < visibleFrom) {
      const r = (tabs[visibleTo] as HTMLElement).getBoundingClientRect();
      return r.left - barR.left;
    } else {
      const r = (tabs[visibleTo] as HTMLElement).getBoundingClientRect();
      return r.right - barR.left;
    }
  })();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="tab-bar"
  bind:this={tabBarEl}
  on:contextmenu|preventDefault={(e) => onBarContextMenu(e.clientX, e.clientY)}
>
  <!-- 顶部留白：也是拖动区域 -->
  <div class="drag-strip" data-tauri-drag-region></div>

  <!-- 左侧 Logo -->
  <div class="app-logo" class:mac-space={isMac} data-tauri-drag-region>
    <img src="/tab-icon.png" alt="FinchPad" />
  </div>

  {#each titles.slice(visibleStart, visibleEnd) as title, k}
    {@const absIdx = visibleStart + k}
    {@const isActive = absIdx === activeIndex}
    {@const isDirty = dirtyStates[absIdx] ?? false}
    {@const isHovered = hoveredIndex === absIdx}
    {@const isBeingDragged = isDragging && absIdx === dragFromIndex}
    <div
      class="tab"
      class:active={isActive}
      class:dragging={isBeingDragged}
      style="width: {tabWidth}px;"
      use:tooltip={paths[absIdx]}
      on:click={(e) => onTabClick(e, absIdx)}
      on:keydown={(e) => e.key === 'Enter' && onSelect(absIdx)}
      on:mouseenter={() => (hoveredIndex = absIdx)}
      on:mouseleave={() => (hoveredIndex = -1)}
      on:mousedown={(e) => onTabMouseDown(e, absIdx)}
      on:contextmenu|preventDefault|stopPropagation={(e) =>
        onContextMenu(absIdx, e.clientX, e.clientY)}
      role="tab"
      tabindex="0"
      aria-selected={isActive}
    >

      {#if absIdx === renamingIndex}
        <input
          bind:this={renameInputEl}
          class="rename-input"
          bind:value={renameValue}
          on:keydown|stopPropagation={handleRenameKeydown}
          on:blur={handleRenameBlur}
          on:click|stopPropagation
          on:mousedown|stopPropagation
        />
      {:else}
        <span class="title">{title}</span>
      {/if}

      {#if isDirty}
        {#if isHovered}
          <button
            class="close"
            on:click|stopPropagation={() => onClose(absIdx)}
            aria-label="关闭标签">×</button>
        {:else}
          <span class="dot" aria-label="未保存">●</span>
        {/if}
      {:else if isHovered || isActive}
        <button
          class="close"
          on:click|stopPropagation={() => onClose(absIdx)}
          aria-label="关闭标签">×</button>
      {/if}
    </div>
  {/each}

  {#if hasOverflow}
    <div class="dropdown-wrapper">
      <button
        class="dropdown-btn"
        bind:this={dropdownButtonEl}
        on:click={toggleDropdown}
        aria-label="更多标签"
      >
        ▼
      </button>
      {#if dropdownOpen}
        <div
          class="dropdown-menu"
          bind:this={dropdownMenuEl}
          style="left: {dropdownLeft}px; top: {dropdownTop}px;"
        >
          {#each hiddenIndices as idx}
            <button
              class="dropdown-item"
              class:active={idx === activeIndex}
              use:tooltip={paths[idx]}
              on:click={() => selectFromDropdown(idx)}
            >{titles[idx]}</button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <button
    class="new-tab"
    on:click={onNew}
    on:contextmenu|preventDefault|stopPropagation
    aria-label="新建标签">+</button>

  <div
    class="blank-area"
    data-tauri-drag-region
    on:contextmenu|preventDefault={(e) => onBarContextMenu(e.clientX, e.clientY)}
  ></div>

  <button
    class="settings-btn"
    on:click={(e) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      onSettingsClick(rect.right, rect.bottom);
    }}
    aria-label="设置"
  >

    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  </button>

  <!-- 窗口控制按钮（Windows 11 风格）—— 仅在非 Mac 平台渲染 -->
  {#if !isMac}
    <button class="window-btn" on:click={handleMinimize} aria-label="最小化">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1" />
      </svg>
    </button>

    <button class="window-btn" on:click={handleToggleMaximize} aria-label={isMaximized ? '还原' : '最大化'}>
      {#if isMaximized}
        <svg width="10" height="10" viewBox="0 0 10 10">
          <rect x="0" y="2" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1" />
          <polyline points="2,2 2,0 10,0 10,8 8,8" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      {:else}
        <svg width="10" height="10" viewBox="0 0 10 10">
          <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      {/if}
    </button>

    <button class="window-btn window-btn-close" on:click={handleClose} aria-label="关闭">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="1" />
        <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="1" />
      </svg>
    </button>
  {/if}

  {#if dragIndicatorX >= 0}
    <div class="drag-indicator" style="left: {dragIndicatorX}px;"></div>
  {/if}
</div>

<style>
  .tab-bar {
    display: flex;
    background: var(--tab-bar-background);
    height: 38px;           /* 32 + 6 */
    align-items: stretch;
    user-select: none;
    position: relative;
    box-sizing: border-box;
  }
  .drag-strip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
  }

  .app-logo {
    width: 28px;
    height: 28px;
    margin-top: 6px;
    margin-left: 6px;
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    user-select: none;
  }
  .app-logo img {
    width: 20px;
    height: 20px;
    display: block;
    pointer-events: none;
  }
  .app-logo.mac-space {
    margin-left: 75px; /* 给 Mac 的红黄绿按钮留出空间 */
  }  

  .tab {
    display: flex;
    align-items: center;
    padding: 0 5px 0 10px;
    margin-top: 6px;
    height: 32px;
    background: var(--tab-background);
    border-right: 1px solid var(--tab-border);
    cursor: pointer;
    font-size: 13px;
    color: var(--tab-foreground);
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: hidden;
    /* outline: none; */
  }
  .tab.active {
    background: var(--tab-background-active);
    color: var(--tab-foreground-active);
    border-radius: 8px 8px 0 0;
    border-right-color: transparent;
  }
  .tab.dragging {
    opacity: 0.5;
  }
  .title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rename-input {
    flex: 1;
    width: 100%;
    min-width: 0;
    background: var(--editor-background);
    border: 1px solid var(--accent);
    border-radius: 2px;
    color: var(--tab-foreground);
    font-size: 13px;
    font-family: inherit;
    padding: 0 4px;
    outline: none;
    height: 20px;
    box-sizing: border-box;
  }  
  .dot {
    color: var(--tab-foreground);
    font-size: 6px;
    line-height: 1;
    padding: 0 6px;
    user-select: none;
    flex-shrink: 0;
  }
  .tab.active .dot {
    color: var(--tab-foreground-active);
  }
  .close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--tab-foreground);
    font-size: 16px;
    padding: 0 4px;
    line-height: 1;
    flex-shrink: 0;
  }
  .close:hover {
    color: var(--tab-foreground-active);
  }
  .new-tab {
    background: transparent;
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    color: var(--tab-foreground);
    font-size: 20px;
    width: 32px;
    margin-top: 6px;
    margin-left: 6px;
    height: 32px;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .new-tab:hover {
    background: var(--overlay-hover-background);
  }

  .blank-area {
    flex: 1;
    min-width: 0;
    margin-top: 6px;
    height: 32px;
  }
  .settings-btn {
    background: transparent;
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    color: var(--tab-foreground);
    font-size: 18px;
    width: 32px;
    margin-top: 6px;
    height: 32px;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .settings-btn:hover {
    background: var(--overlay-hover-background);
  }

  .window-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--tab-foreground);
    width: 46px;
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: background-color 0.1s;
  }
  .window-btn:hover {
    background: var(--overlay-hover-background);
  }
  .window-btn:active {
    filter: brightness(0.9);
  }
  .window-btn-close:hover {
    background: #E81123;
    color: white;
  }  

  .dropdown-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 32px;
    margin-top: 6px;
    height: 32px;
  }
  .dropdown-btn {
    background: transparent;
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tab-foreground);
    font-size: 10px;
    box-sizing: border-box;
  }
  .dropdown-btn:hover {
    background: var(--overlay-hover-background);
  }
  .dropdown-menu {
    position: fixed;
    background: var(--overlay-background); 
    border: 1px solid var(--overlay-border);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 140px;
    max-width: 400px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 500;
    padding: 4px;
    box-sizing: border-box;
  }
  .dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    color: var(--overlay-foreground);
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .dropdown-item:hover {
    background: var(--overlay-hover-background);
  }
  .dropdown-item.active {
    background: var(--overlay-hover-background);
    font-weight: 600;
  }
  .drag-indicator {
    position: absolute;
    top: 2px;
    bottom: 2px;
    width: 2px;
    background: var(--accent);
    pointer-events: none;
    border-radius: 1px;
  }
</style>