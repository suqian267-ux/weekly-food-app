# 一周好好吃饭（安卓 PWA）

## 文件
- `index.html`：应用界面
- `recipes.json`：菜单数据，日后更新菜单只需替换此文件
- `manifest.webmanifest`、`sw.js`、`icon.svg`：安卓桌面安装与缓存

## 用 GitHub Pages 发布（手机也可操作）
1. 在 GitHub 新建一个 Public repository，例如 `weekly-food-app`。
2. 进入仓库，点 Add file → Upload files，把本文件夹内的**所有文件**上传到仓库根目录（不要把整个文件夹再套一层）。
3. Commit changes。
4. 打开仓库 Settings → Pages。
5. 在 Build and deployment 中选择 Deploy from a branch；Branch 选 `main`，文件夹选 `/ (root)`，保存。
6. 等待 GitHub Pages 显示网址，通常形如 `https://你的用户名.github.io/weekly-food-app/`。
7. 用安卓 Chrome 打开网址，菜单加载成功后，点右上角菜单 → 添加到主屏幕/安装应用。

## 更新菜单
编辑并替换仓库根目录的 `recipes.json`，提交后应用联网重新打开即可读取新菜单。当前版本没有连接 AI 自动生成服务；它只会自动读取已经发布的新 JSON 文件。不要把 GitHub Personal Access Token 或密码发到聊天里。

## 重要
这是静态 PWA，不是 APK。它可添加到安卓桌面；首次发布需要你在 GitHub 网页点几下。若要真正每周自动生成并发布新食谱，还需要额外配置安全的自动化服务和模型 API 凭据。
