---
name: large-harness
description: >-
  为大型项目创建完整的 harness 体系。当判断为大型项目时使用此技能——创建路由式的 AGENTS.md、
  完整的文档体系、执行计划管理、治理结构和质量评分。适用于多模块、多轮会话、长期演化的
  复杂项目。
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [harness, large-project, governance, documentation]
---

# 大型项目 Harness 创建

为大型项目创建完整的 harness 体系，为后续的业务开发提供治理结构。

## 适用场景

- 多模块、多轮会话的复杂项目
- 长期演化项目
- 多人团队开发
- 需要完整治理结构

## 核心原则

- **短入口，深链接**：AGENTS.md 保持简短，深层规则放在 docs/ 中
- **仓库就是唯一事实来源**：所有文档和规则都在仓库中
- **机械约束优先于口头约定**：通过文件和结构强制执行规则
- **计划、质量和技术债都和代码一起版本化**：文档与代码同步更新

## 首先步骤

1. **检查现有结构**：查看项目是否已有文档体系、治理结构等。
2. **评估项目规模**：确定是否需要完整的大型项目 harness。
3. **检测 harness 结构**：判断是新项目还是已有项目。
4. **创建或更新 harness**：根据检测结果决定操作。

## 检测现有结构

在创建 harness 之前，先检测项目是否已有结构：

```bash
# 检测是否存在 project-state 目录
test -d project-state && echo "project-state 目录存在"

# 检测是否存在 features.json
test -f project-state/features.json && echo "features.json 存在"

# 检测是否存在 AGENTS.md
test -f AGENTS.md && echo "AGENTS.md 存在"

# 检测是否存在 ARCHITECTURE.md
test -f ARCHITECTURE.md && echo "ARCHITECTURE.md 存在"
```

**判断结果：**
- 如果 `project-state/features.json` 不存在 → 新项目，创建完整结构
- 如果 `project-state/features.json` 已存在 → 已有项目，只添加新功能

## 创建大型项目 Harness

### 1. 创建路由式 AGENTS.md

创建一个简短的 `AGENTS.md`，作为路由入口：

```markdown
# 项目代理指令

## 快速导航
- 架构详情：`ARCHITECTURE.md`
- 设计文档：`docs/design-docs/`
- 执行计划：`docs/exec-plans/`
- 产品规格：`docs/product-specs/`
- 参考材料：`docs/references/`

## 工作规则
1. 阅读相关文档了解上下文
2. 遵循架构设计原则
3. 更新执行计划和进度
4. 运行验证命令确保质量

## 完成定义
- 代码通过所有测试
- 文档已更新
- 执行计划已更新
- 质量评分达标
```

### 2. 创建文档体系

从 `repo-template` 复制文档结构：

```bash
# 复制文档结构
cp -r docs/your-project/docs/design-docs/
cp -r docs/your-project/docs/exec-plans/
cp -r docs/your-project/docs/product-specs/
cp -r docs/your-project/docs/references/
```

### 3. 创建治理文件

创建以下治理文件：

- `ARCHITECTURE.md` - 架构设计文档
- `DESIGN.md` - 设计原则文档
- `FRONTEND.md` - 前端治理文档
- `PLANS.md` - 执行计划管理
- `PRODUCT_SENSE.md` - 产品感知文档
- `QUALITY_SCORE.md` - 质量评分标准
- `RELIABILITY.md` - 可靠性文档
- `SECURITY.md` - 安全文档

### 4. 设置执行计划管理

创建执行计划目录结构：

```
docs/exec-plans/
├── active/          # 活跃执行计划
├── completed/       # 已完成计划
└── tech-debt-tracker.md  # 技术债跟踪
```

### 5. 创建或更新项目状态管理

大型项目需要更完善的状态管理结构：

**新项目模式：** 创建完整的 `project-state/` 目录结构

```
project-state/
├── features.json           # 功能列表（多功能并行）
├── active-executions/      # 活跃执行计划
│   └── YYYY-MM-DD-<feature>.json
├── completed/              # 已完成功能
│   └── YYYY-MM-DD-<feature>.json
└── tech-debt-tracker.md    # 技术债跟踪
```

**已有项目模式：** 只更新 `project-state/features.json`，添加新功能

```bash
# 检查 project-state 目录是否存在
test -d project-state || mkdir -p project-state

# 读取现有 features.json（如果存在）
test -f project-state/features.json && cat project-state/features.json
```

#### features.json 结构

```json
{
  "project_name": "项目名称",
  "version": "1.0.0",
  "features": [
    {
      "id": "feature-001",
      "name": "功能名称",
      "status": "planning",
      "priority": "high",
      "owner": "负责人",
      "created_at": "2026-07-02",
      "spec_path": "docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md",
      "architecture_path": "ARCHITECTURE.md",
      "plan_path": "docs/exec-plans/active/YYYY-MM-DD-<feature>.md",
      "tasks": [],
      "next_step": "等待 writing-plans 规划实现步骤",
      "dependencies": [],
      "tags": ["core", "api"]
    }
  ],
  "completed_features": []
}
```

**已有项目更新逻辑：**

```bash
# 读取现有 features.json
existing_features=$(cat project-state/features.json)

# 将当前活跃功能移动到 completed_features
# 添加新功能到 features 数组
# 更新 project-state/features.json
```

#### 功能状态流转

```
planning → planned → in_progress → testing → completed
    ↓         ↓           ↓           ↓
  backlog  blocked     blocked     failed
```

#### 执行计划集成

- 每个功能对应一个执行计划文件：`docs/exec-plans/active/YYYY-MM-DD-<feature>.md`
- 执行计划完成后移动到：`docs/exec-plans/completed/`
- 技术债记录在：`docs/exec-plans/tech-debt-tracker.md`

### 6. 配置参考材料目录

创建参考材料目录：

```
docs/references/
├── design-system-reference-llms.txt  # 设计系统参考
├── nixpacks-llms.txt                 # 部署参考
└── uv-llms.txt                       # 包管理参考
```

## 设计规则

- **AGENTS.md 保持简短**：只包含路由和不变量，不包含完整手册。
- **项目事实放在项目文档中**：不要在 skill 中重复项目信息。
- **验证命令明确可运行**：所有验证命令必须明确且可执行。
- **完成功能需要证据**：测试通过、验证成功、文档更新。
- **状态文件优先于聊天历史**：使用文件跟踪状态，而不是依赖聊天记录。
- **破坏性操作需要明确批准**：脚本中的覆盖操作需要用户明确批准。

## 可交付清单

确保目标项目包含以下文件：

**核心文件：**
- [ ] `AGENTS.md`（路由式指令文件）
- [ ] `ARCHITECTURE.md`（架构设计文档）
- [ ] `project-state/features.json`（功能状态管理）

**文档体系：**
- [ ] `docs/design-docs/`（设计文档目录）
- [ ] `docs/exec-plans/active/`（活跃执行计划）
- [ ] `docs/exec-plans/completed/`（已完成计划）
- [ ] `docs/exec-plans/tech-debt-tracker.md`（技术债跟踪）
- [ ] `docs/product-specs/`（产品规格目录）
- [ ] `docs/references/`（参考材料目录）

**治理文件：**
- [ ] `DESIGN.md`（设计原则文档）
- [ ] `FRONTEND.md`（前端治理文档）
- [ ] `PLANS.md`（执行计划管理）
- [ ] `PRODUCT_SENSE.md`（产品感知文档）
- [ ] `QUALITY_SCORE.md`（质量评分标准）
- [ ] `RELIABILITY.md`（可靠性文档）
- [ ] `SECURITY.md`（安全文档）

## 常见问题

### 何时使用大型项目 harness？

- 项目包含多个模块
- 开发周期长（超过 2 周）
- 需要复杂治理结构
- 多人团队开发
- 长期演化项目

### 何时应该从大型项目 harness 简化？

- 项目变得过于复杂
- 文档维护成本过高
- 团队规模缩小
- 项目进入稳定期

### 如何维护 harness？

- 定期更新执行计划和进度
- 保持文档与代码同步
- 定期审查质量评分
- 清理过时的文档和计划
