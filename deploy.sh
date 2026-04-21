#!/bin/bash
# 部署脚本：本地构建并推送到 gh-pages（绕过 Actions 计费限制）
# 用法：./deploy.sh [commit message]

set -e

MSG="${1:-deploy: update site}"
DIST_TMP="/tmp/stools-dist-$$"
ON_GHPAGES=false

cleanup() {
  if [ "$ON_GHPAGES" = true ]; then
    echo "异常退出，切回 main..."
    git checkout main --force
  fi
  rm -rf "$DIST_TMP"
}
trap cleanup EXIT

# 确保在 main 分支
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  echo "当前不在 main 分支（在 $BRANCH），请先切回 main"
  exit 1
fi

# 检查是否有未提交的改动
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "main 分支有未提交的改动，先提交："
  git add -A
  git commit -m "$MSG"
  git push origin main
  echo "main 已提交并推送"
else
  echo "main 分支干净"
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
  echo "安装依赖..."
  npm install
fi

# 构建
echo "构建中..."
npm run build

# 提交版本号递增
if ! git diff --quiet package.json package-lock.json; then
  git add package.json package-lock.json
  git commit -m "chore: bump version to $(node -p 'require(\"./package.json\").version')"
  git push origin main
fi

# 复制构建产物到临时目录
rm -rf "$DIST_TMP"
cp -r dist "$DIST_TMP"

# 确保 gh-pages 分支存在
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
  echo "创建 gh-pages 分支..."
  git checkout --orphan gh-pages
  git rm -rf .
  git commit --allow-empty -m "init gh-pages"
  git push origin gh-pages
  git checkout main --force
fi

# 切到 gh-pages
git checkout gh-pages
ON_GHPAGES=true

# 清除旧文件（保留 .git、node_modules、.vite）
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '.git' \
  ! -name 'node_modules' \
  ! -name '.vite' \
  -exec rm -rf {} +

# 复制新构建产物
cp -r "$DIST_TMP"/* .
touch .nojekyll
echo "st.fangs.cc" > CNAME

# 提交并推送（排除 node_modules 和 .vite）
git add -A -- ':!node_modules' ':!.vite'

if git diff --cached --quiet; then
  echo "没有变化，跳过部署"
else
  git commit -m "$MSG"
  git push origin gh-pages
  echo "已部署到 gh-pages"
fi

# 切回 main
git checkout main --force
ON_GHPAGES=false

echo "完成！等 1-2 分钟后刷新 st.fangs.cc 查看"
