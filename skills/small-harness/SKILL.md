---
name: small-harness
description: >-
  为小型项目创建基本的 harness 结构。当判断为小项目时使用此技能——创建简洁的 AGENTS.md、
  基本的 feature_list.json、简单的验证命令和进度跟踪。适用于功能单一、开发周期短、
  不需要复杂治理结构的项目。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [harness, small-project, setup]
---

# 小项目 Harness 创建

为小型项目创建基本的 harness 结构，确保 AI 编程代理能够可靠地工作。

## 适用场景

- 功能单一的项目
- 开发周期短（1-2 周）
- 单人开发或小团队
- 不需要复杂治理结构

## 核心模型

小项目 harness 包含以下基本组件：

| 组件 | 文件 | 用途 |
|------|------|------|
| 指令 | `AGENTS.md` 或 `CLAUDE.md` | 启动路径、工作规则、完成定义 |
| 状态 | `feature_list.json` | 当前功能、状态、证据、下一步 |
| 验证 | 文档化命令 | 测试/检查，完成前必须运行 |
| 进度 | `progress.md` | 简单的进度跟踪 |

## 首先步骤

1. **检查现有文件**：查看项目是否已有指令文件、状态文件、验证命令等。
2. **询问缺失上下文**：确定目标代理、文件命名偏好、是否允许覆盖。
3. **检测 harness 结构**：判断是新项目还是已有项目。
4. **创建或更新 harness**：根据检测结果决定操作。

## 检测现有结构

在创建 harness 之前，先检测项目是否已有结构：

```bash
# 检测是否存在 feature_list.json
test -f feature_list.json && echo "feature_list.json 存在"

# 检测是否存在 AGENTS.md 或 CLAUDE.md
test -f AGENTS.md && echo "AGENTS.md 存在"
test -f CLAUDE.md && echo "CLAUDE.md 存在"
```

**判断结果：**
- 如果 `feature_list.json` 不存在 → 新项目，创建完整结构
- 如果 `feature_list.json` 已存在 → 已有项目，只添加新功能

## 创建小项目 Harness

### 1. 创建 AGENTS.md

创建一个简洁的 `AGENTS.md` 文件，包含：

```markdown
# 项目代理指令

## 启动路径
1. 阅读 `README.md` 了解项目
2. 检查 `feature_list.json` 了解当前状态
3. 运行验证命令确保环境正常

## 工作规则
- 每次只处理一个功能
- 完成前必须运行验证命令
- 更新 `feature_list.json` 和 `progress.md`

## 完成定义
- 代码通过所有测试
- 文档已更新
- 验证命令成功运行
```

### 2. 创建或更新 feature_list.json

**新项目模式：** 创建 `feature_list.json` 文件

```json
{
  "current_feature": {
    "name": "功能名称（来自 brainstorming 规格）",
    "status": "planning",
    "description": "功能描述（来自 brainstorming 规格）",
    "spec_path": "docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md",
    "tasks": [],
    "next_step": "等待 writing-plans 规划实现步骤"
  },
  "completed_features": []
}
```

**已有项目模式：** 读取现有 `feature_list.json`，将当前功能添加到 `completed_features`，然后更新 `current_feature`

```bash
# 读取现有内容
cat feature_list.json

# 将 current_feature 移动到 completed_features
# 然后更新 current_feature 为新功能
```

**更新后的结构：**

```json
{
  "current_feature": {
    "name": "新功能名称",
    "status": "planning",
    "description": "新功能描述",
    "spec_path": "docs/superpowers/specs/YYYY-MM-DD-<new-topic>-design.md",
    "tasks": [],
    "next_step": "等待 writing-plans 规划实现步骤"
  },
  "completed_features": [
    {
      "name": "旧功能名称",
      "status": "completed",
      "description": "旧功能描述",
      "spec_path": "...",
      "completed_at": "2026-07-01"
    }
  ]
}
```

**关键点：**
- `spec_path` 指向 brainstorming 创建的规格文件
- `status` 设为 "planning"，表示正在规划阶段
- `tasks` 为空数组，等待 writing-plans 填充
- `next_step` 指明下一步由 writing-plans 规划实现步骤
- 已有项目会保留历史功能记录

### 3. 创建 progress.md

创建一个简单的 `progress.md` 文件：

```markdown
# 进度日志

## 当前状态
- 功能：示例功能
- 状态：进行中
- 开始时间：YYYY-MM-DD

## 进度记录
- YYYY-MM-DD：开始功能开发
```

### 4. 文档化验证命令

在 `README.md` 或单独的 `VERIFICATION.md` 中记录验证命令：

```markdown
## 验证命令

运行以下命令验证项目状态：

```bash
# 运行测试
npm test

# 运行 lint
npm run lint

# 构建项目
npm run build
```

完成功能前必须确保所有命令成功运行。
```

## 设计规则

- **保持简洁**：小项目 harness 应该简单明了，避免过度工程化。
- **明确验证**：验证命令必须明确且可运行。
- **证据优先**：完成功能需要证据（测试通过、验证成功）。
- **单一功能**：一次只处理一个功能，避免范围蔓延。
- **状态跟踪**：使用文件跟踪状态，而不是依赖聊天历史。

## 可交付清单

确保目标项目包含以下文件：

- [ ] `AGENTS.md` 或 `CLAUDE.md`（基本指令）
- [ ] `feature_list.json`（功能状态跟踪）
- [ ] `progress.md`（进度日志）
- [ ] `README.md` 包含验证命令（或单独的 `VERIFICATION.md`）

## 常见问题

### 何时使用小项目 harness？

- 项目功能单一
- 开发周期短
- 不需要复杂治理结构
- 团队规模小

### 何时应该升级到大型项目 harness？

- 项目开始包含多个模块
- 开发周期变长
- 需要更复杂的治理结构
- 团队规模扩大

### 如何维护 harness？

- 定期更新 `feature_list.json` 和 `progress.md`
- 完成功能后更新状态
- 保持验证命令最新
