# GitHub Actions 故障排查指南

## 常见错误及解决方案

### 错误 1: Permission denied (publickey)
**症状：** push 到外部仓库时被拒绝

**原因：** DEPLOY_TOKEN 未配置或权限不足

**解决：**
1. 确认 Secret 名称是 `DEPLOY_TOKEN`（大小写精确）
2. 重新生成 Token，确保勾选 `repo` 完整权限
3. 重新添加到私有仓库 Secrets

---

### 错误 2: Resource not accessible by integration
**症状：** GitHub Token 权限不足

**原因：** 使用了 `GITHUB_TOKEN` 而不是 Personal Access Token

**解决：**
- workflow 中必须使用 `personal_token: ${{ secrets.DEPLOY_TOKEN }}`
- 不要使用 `github_token: ${{ secrets.GITHUB_TOKEN }}`

---

### 错误 3: npm install 失败
**症状：** 依赖安装报错

**原因：** package-lock.json 或网络问题

**解决：**
```yaml
# 改用 npm install 而不是 npm ci
- run: npm install
```

---

### 错误 4: Build 失败
**症状：** npm run build 报错

**原因：** 环境变量缺失或代码错误

**解决：**
1. 本地运行 `npm run build` 验证
2. 检查是否需要环境变量（.env）
3. 在 workflow 的 env: 中添加必要变量

---

### 错误 5: 推送到公开仓库失败
**症状：** peaceiris/actions-gh-pages 报错

**原因：** 仓库名或分支名错误

**解决：**
确认配置：
```yaml
external_repository: Ning0713/Ning0713.github.io  # 精确匹配
publish_branch: main  # 或 gh-pages
```

---

## 调试步骤

### 1. 查看完整日志
- 进入 Actions 页面
- 点击失败的工作流
- 展开每个 step 查看详细输出

### 2. 检查 Secret 配置
- 私有仓库 → Settings → Secrets and variables → Actions
- 确认 DEPLOY_TOKEN 存在

### 3. 手动触发
- Actions 页面 → Deploy to GitHub Pages
- 点击 "Run workflow" → Run workflow

### 4. 本地模拟构建
```bash
cd "F:\All 资源集合\Coding\Engine\Ning0713.github.io"
npm install
npm run build
# 检查 dist/ 是否生成
ls dist/
```

---

## 成功标志

✅ Actions 页面显示绿色 ✓
✅ 公开仓库出现新的 commit（来自 github-actions[bot]）
✅ https://ning0713.top 可以访问
✅ 查看页面源码包含最新内容

---

## 回滚方案

如果迁移失败，恢复到单仓库模式：

```bash
cd "F:\All 资源集合\Coding\Engine\Ning0713.github.io"

# 删除私有仓库远程
git remote remove private

# 禁用新 workflow
git rm .github/workflows/deploy-to-pages.yml
git commit -m "Rollback to single repository"
git push origin main

# 恢复旧的 deploy.yml（如果有）
```
