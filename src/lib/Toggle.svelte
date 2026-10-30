<script lang="ts">
    export let checked: boolean = false;
    export let onChange: (value: boolean) => void = () => {};
    export let disabled: boolean = false; // ★ 新增：接收禁用状态
</script>

<button
    class="toggle-capsule"
    class:on={checked}
    class:off={!checked}
    class:disabled
    // ★ 新增：禁用状态的样式
    {disabled}
    // ★ 新增：物理禁用
    onclick={(e) => {
        if (disabled) return; // ★ 防御：禁用时阻止点击
        e.stopPropagation();
        onChange(!checked);
    }}
    role="switch"
    aria-checked={checked}
    tabindex="0"
    onkeydown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
        }
    }}
>
    <div class="thumb"></div>
</button>

<style>
    .toggle-capsule {
        position: relative;
        width: 20px; /* ★ 统一尺寸：宽 20px */
        height: 12px; /* ★ 统一尺寸：高 12px */
        border-radius: 99px;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: background-color 0.25s;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        outline: none;
        /* ★ 扩大点击热区，视觉只有 20x12，但可点击范围上下左右各扩大 6px */
        box-shadow: 0 0 0 6px transparent;
    }

    /* 圆点 */
    .thumb {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ffffff;
        left: 1px;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* 开启状态 */
    .on {
        /* ★ 使用指定的主题亮色 */
        background: var(--accent);
        /* 加一点极微弱的内阴影，让胶囊看起来更有立体感 */
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .on .thumb {
        /* 开启时圆点纯白，产生清晰的对比 */
        background: #ffffff;
        /* 位移距离 = 20(总宽) - 10(圆点) - 1(左边距) - 1(右边距) = 8px */
        transform: translateX(8px);
    }

    /* 关闭状态 */
    .off {
        /* 关闭状态保持低调的灰色 */
        background: color-mix(
            in srgb,
            var(--status-bar-foreground) 15%,
            transparent
        );
    }

    .off .thumb {
        background: var(--status-bar-foreground-muted);
        transform: translateX(0);
    }

    .toggle-capsule:hover {
        opacity: 0.8;
    }

    /* ★ 新增：禁用时的置灰样式 */
    .toggle-capsule:disabled,
    .toggle-capsule.disabled {
        opacity: 0.4; /* 变灰 */
        cursor: default;
        pointer-events: none; /* 彻底切断鼠标交互 */
    }
</style>
