---
name: writing-plans
description: 当你有规格说明或需求用于多步骤任务时使用，在动手写代码之前
version: "1.0.0"
license: MIT
metadata:
  hermes:
    tags: [planning, documentation]
---

# 编写计划

## 概述

编写全面的实现计划，假设工程师对我们的代码库零上下文，且品味存疑。记录他们需要知道的一切：每个任务要修改哪些文件、代码、测试、可能需要查阅的文档、如何测试。将整个计划拆成小步骤任务。DRY。YAGNI。TDD。频繁 commit。

假设他们是有经验的开发者，但对我们的工具链和问题领域几乎一无所知。假设他们不太擅长测试设计。

**开始时宣布：** "我正在使用 writing-plans 技能创建实现计划。"

**上下文：** 此技能应在专用 worktree 中运行（由 brainstorming 技能创建）。

**前置条件：** harness skill 已将 brainstorming 规格写入 `feature_list.json` 或 `project-state/features.json`。

**计划保存位置：**
- **小项目**：`docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- **大型项目**：`docs/exec-plans/active/YYYY-MM-DD-<feature-name>.md`
- （用户对计划位置的偏好优先于此默认值）

## 读取项目状态

在开始规划之前，先读取项目状态文件获取当前功能信息：

**检测项目类型：**
- 检查是否存在 `feature_list.json`（小项目）
- 检查是否存在 `project-state/features.json`（大型项目）

**小项目模式（读取 feature_list.json）：**
```bash
cat feature_list.json
```

**大型项目模式（读取 project-state/features.json）：**
```bash
cat project-state/features.json
```

**关键字段：**
- `name` / `current_feature.name`：功能名称
- `description` / `current_feature.description`：功能描述
- `spec_path` / `current_feature.spec_path`：规格文件路径
- `architecture_path` / `current_feature.architecture_path`：架构文档路径（大型项目才有）
- `status` / `current_feature.status`：当前状态（应为 "planning"）
- `plan_path`：执行计划路径（大型项目）

**如果状态文件不存在或缺少关键字段：**
- 询问用户功能名称和描述
- 创建状态文件并设置 status 为 "planning"

**读取规格文件：**
- 根据 `spec_path` 读取完整的规格文档
- 如果存在 `architecture_path`，也读取架构文档作为参考

**处理已有项目：**
- 如果 `status` 不是 "planning"，说明是已有项目
- 读取现有功能历史，了解之前的实现
- 基于现有上下文规划新功能的实现步骤

## 更新项目状态

规划完成后，更新对应的状态文件：

**小项目模式（更新 feature_list.json）：**

```json
{
  "current_feature": {
    "name": "功能名称",
    "status": "planned",
    "description": "功能描述",
    "spec_path": "docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md",
    "tasks": [
      {
        "name": "任务1名称",
        "status": "pending",
        "plan_path": "docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md#任务-1",
        "estimated_time": "5分钟"
      }
    ],
    "next_step": "执行任务1：[任务1名称]"
  },
  "completed_features": []
}
```

**大型项目模式（更新 project-state/features.json）：**

```json
{
  "project_name": "项目名称",
  "version": "1.0.0",
  "features": [
    {
      "id": "feature-001",
      "name": "功能名称",
      "status": "planned",
      "priority": "high",
      "owner": "负责人",
      "created_at": "2026-07-02",
      "spec_path": "docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md",
      "architecture_path": "ARCHITECTURE.md",
      "plan_path": "docs/exec-plans/active/YYYY-MM-DD-<feature>.md",
      "tasks": [
        {
          "name": "任务1名称",
          "status": "pending",
          "plan_path": "docs/exec-plans/active/YYYY-MM-DD-<feature>.md#任务-1",
          "estimated_time": "5分钟"
        }
      ],
      "next_step": "执行任务1：[任务1名称]",
      "dependencies": [],
      "tags": ["core", "api"]
    }
  ],
  "completed_features": []
}
```

**状态流转：**
- `planning` → `planned`（writing-plans 完成后）
- `planned` → `in_progress`（开始执行任务）
- `in_progress` → `completed`（所有任务完成）

**执行计划管理（大型项目）：**

对于大型项目，执行计划保存在 `docs/exec-plans/` 目录：
- `docs/exec-plans/active/` - 活跃执行计划
- `docs/exec-plans/completed/` - 已完成计划
- `docs/exec-plans/tech-debt-tracker.md` - 技术债跟踪

**技术债处理：**
- 在实现过程中发现的技术债，记录到 `docs/exec-plans/tech-debt-tracker.md`
- 技术债包括：未优化的代码、缺少测试、过时的依赖等
- 记录格式：日期、区域、债务、延后原因、风险、下次触发点

## 范围检查

如果规格涵盖了多个独立子系统，它应该在头脑风暴阶段就被拆分为子项目规格。如果没有，建议将其拆分为独立的计划——每个子系统一个。每个计划应该能独立产出可工作、可测试的软件。

## 文件结构

在定义任务之前，先列出将要创建或修改的文件以及每个文件的职责。这是锁定分解决策的地方。

- 设计边界清晰、接口定义良好的单元。每个文件应有一个明确的职责。
- 你对能一次放入上下文的代码推理得最好，文件越专注你的编辑越可靠。优先选择小而专注的文件，而非承担过多功能的大文件。
- 一起变更的文件应放在一起。按职责拆分，而非按技术层级拆分。
- 在现有代码库中，遵循已有模式。如果代码库使用大文件，不要单方面重构——但如果你正在修改的文件已经变得难以管理，在计划中包含拆分是合理的。

此结构决定了任务分解。每个任务应产出独立的、有意义的变更。

## 小步骤任务粒度

**每步是一个操作（2-5 分钟）：**
- "编写失败的测试" - 一步
- "运行它确认失败" - 一步
- "实现最少代码让测试通过" - 一步
- "运行测试确认通过" - 一步
- "Commit" - 一步

## 计划文档头部

**每个计划必须以此头部开始：**

```markdown
# [功能名称] 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** [一句话描述要构建什么]

**架构：** [2-3 句话描述方案]

**技术栈：** [关键技术/库]

---
```

## 任务结构

````markdown
### 任务 N：[组件名称]

**文件：**
- 创建：`exact/path/to/file.py`
- 修改：`exact/path/to/existing.py:123-145`
- 测试：`tests/exact/path/to/test.py`

- [ ] **步骤 1：编写失败的测试**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **步骤 2：运行测试验证失败**

运行：`pytest tests/path/test.py::test_name -v`
预期：FAIL，报错 "function not defined"

- [ ] **步骤 3：编写最少实现代码**

```python
def function(input):
    return expected
```

- [ ] **步骤 4：运行测试验证通过**

运行：`pytest tests/path/test.py::test_name -v`
预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## 禁止占位符

每个步骤都必须包含工程师需要的实际内容。以下是**计划缺陷**——绝不要写出来：
- "待定"、"TODO"、"后续实现"、"补充细节"
- "添加适当的错误处理" / "添加验证" / "处理边界情况"
- "为上述代码编写测试"（没有实际测试代码）
- "类似任务 N"（重复代码——工程师可能不按顺序阅读任务）
- 只描述做什么而不展示怎么做的步骤（代码步骤必须有代码块）
- 引用了未在任何任务中定义的类型、函数或方法

## 注意事项
- 始终使用精确的文件路径
- 每个步骤都包含完整代码——如果步骤涉及代码变更，就展示代码
- 精确的命令和预期输出
- DRY、YAGNI、TDD、频繁 commit

## 自检

编写完整计划后，以全新视角审视规格并对照检查计划。这是你自己执行的检查清单——不是子代理调度。

**1. 规格覆盖度：** 浏览规格中的每个章节/需求。你能指出实现它的任务吗？列出所有遗漏。

**2. 占位符扫描：** 搜索计划中的红旗——上方"禁止占位符"章节中的任何模式。修复它们。

**3. 类型一致性：** 后续任务中使用的类型、方法签名和属性名是否与前面任务中定义的一致？任务 3 中叫 `clearLayers()` 但任务 7 中叫 `clearFullLayers()` 就是 bug。

如果发现问题，直接内联修复。无需重新审查——修好继续推进。如果发现规格中的需求没有对应任务，就添加任务。

## 执行交接

保存计划后，提供执行选项：

**"计划已完成并保存到 `docs/superpowers/plans/<filename>.md`（小项目）或 `docs/exec-plans/active/<filename>.md`（大型项目）。两种执行方式：**

**1. 子代理驱动（推荐）** - 每个任务调度一个新的子代理，任务间进行审查，快速迭代

**2. 内联执行** - 在当前会话中使用 executing-plans 执行任务，批量执行并设有检查点

**选哪种方式？"**

**如果选择子代理驱动：**
- **必需子技能：** 使用 superpowers:subagent-driven-development
- 每个任务一个新子代理 + 两阶段审查

**如果选择内联执行：**
- **必需子技能：** 使用 superpowers:executing-plans
- 批量执行并设有检查点供审查
