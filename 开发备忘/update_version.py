import os
import json
import re

# 获取当前脚本所在目录（即 FinchPad\开发备忘）
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 定义三个目标文件的相对路径
FILES = {
    "package.json": os.path.join(BASE_DIR, "..", "package.json"),
    "tauri.conf.json": os.path.join(BASE_DIR, "..", "src-tauri", "tauri.conf.json"),
    "Cargo.toml": os.path.join(BASE_DIR, "..", "src-tauri", "Cargo.toml")
}

def get_versions():
    versions = {}
    try:
        # 1. 读取 package.json
        with open(FILES["package.json"], "r", encoding="utf-8") as f:
            versions["package.json"] = json.load(f).get("version", "未找到")
        
        # 2. 读取 tauri.conf.json
        with open(FILES["tauri.conf.json"], "r", encoding="utf-8") as f:
            versions["tauri.conf.json"] = json.load(f).get("version", "未找到")
            
        # 3. 读取 Cargo.toml
        with open(FILES["Cargo.toml"], "r", encoding="utf-8") as f:
            content = f.read()
            # 使用正则匹配顶部的 version = "x.y.z" (通常在 [package] 下面)
            match = re.search(r'^version\s*=\s*"([^"]+)"', content, re.MULTILINE)
            if match:
                versions["Cargo.toml"] = match.group(1)
            else:
                versions["Cargo.toml"] = "未找到"
    except Exception as e:
        print(f"读取文件出错：{e}")
        
    return versions

def update_versions(new_version):
    # 1. 更新 package.json
    with open(FILES["package.json"], "r", encoding="utf-8") as f:
        data = json.load(f)
    data["version"] = new_version
    with open(FILES["package.json"], "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    # 2. 更新 tauri.conf.json
    with open(FILES["tauri.conf.json"], "r", encoding="utf-8") as f:
        data = json.load(f)
    data["version"] = new_version
    with open(FILES["tauri.conf.json"], "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    # 3. 更新 Cargo.toml
    with open(FILES["Cargo.toml"], "r", encoding="utf-8") as f:
        content = f.read()
    # 只替换第一个匹配到的 version = "xxx"
    content = re.sub(r'^version\s*=\s*"[^"]+"', f'version = "{new_version}"', content, count=1, flags=re.MULTILINE)
    with open(FILES["Cargo.toml"], "w", encoding="utf-8") as f:
        f.write(content)

def main():
    while True:
        print("\n" + "="*45)
        print("🔍 正在读取当前版本号...")
        versions = get_versions()
        
        for filename, version in versions.items():
            print(f"  - {filename.ljust(18)} : {version}")
            
        print("="*45)
        
        ans = input("❓ 是否需要更新版本号？(Y/N): ").strip().lower()
        if ans != 'y':
            print("👋 已取消，程序结束。")
            break
            
        new_version = input("✏️ 请输入新版本号 (例如 0.4.0): ").strip()
        if not new_version:
            print("⚠️ 版本号不能为空，请重新输入！")
            continue
            
        confirm = input(f"⚠️ 确认将三个文件的版本号全部修改为 {new_version} 吗？(Y/N): ").strip().lower()
        if confirm != 'y':
            print("👋 已取消本次修改，返回主菜单。")
            continue
            
        try:
            print("\n⏳ 正在修改...")
            update_versions(new_version)
            print("\n✅ 修改成功！以下是更新后的版本号：")
            new_versions = get_versions()
            for filename, version in new_versions.items():
                print(f"  - {filename.ljust(18)} : {version}")
        except Exception as e:
            print(f"\n❌ 修改失败：{e}")
            
        input("\n👉 按回车键继续或退出...")

if __name__ == "__main__":
    main()