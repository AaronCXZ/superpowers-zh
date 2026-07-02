---
name: large-harness
description: >-
  为大型项目创建生产级 harness 体系。当判断为大型项目时使用此技能——采用五子系统模型（指令、状态、验证、范围、生命周期），
  创建分层路由架构、生产级文档体系、智能信息收集机制。适用于多模块、多轮会话、长期演化的
  复杂项目，提供比 small-harness 更强大的生产级治理框架。
version: "2.0.0"
license: MIT
metadata:
  hermes:
    tags: [harness, large-project, governance, documentation, production-grade]
---

# 大型项目生产级 Harness 创建

为大型项目创建生产级 harness 体系，采用五子系统模型，提供完整的生产级治理框架。

## 适用场景

- 多模块、多轮会话的复杂项目
- 长期演化项目
- 多人团队开发
- 需要完整治理结构
- 生产级项目管理

## 核心原则

- **五子系统模型**：指令、状态、验证、范围、生命周期
- **短入口，深链接**：AGENTS.md 保持简短，深层规则放在 docs/ 中
- **仓库就是唯一事实来源**：所有文档和规则都在仓库中
- **机械约束优先于口头约定**：通过文件和结构强制执行规则
- **计划、质量和技术债都和代码一起版本化**：文档与代码同步更新
- **智能信息收集**：自动检测和用户提问补充信息

## 与 small-harness 的区别

| 方面 | small-harness | large-harness |
|------|---------------|---------------|
| 适用场景 | 小型项目 | 大型项目 |
| 文档结构 | 基本文档 | 生产级文档体系 |
| 状态管理 | feature_list.json | project-state/features.json + 多个治理文件 |
| 验证机制 | 基本验证 | 五子系统验证 + 质量评分 |
| 信息收集 | 手动输入 | 智能检测 + 用户提问 |

## 首先步骤

1. **检查现有结构**：查看项目是否已有文档体系、治理结构等。
2. **评估项目规模**：确定是否需要完整的大型项目 harness。
3. **检测 harness 结构**：判断是新项目还是已有项目。
4. **收集项目信息**：智能检测和用户提问补充缺失信息。
5. **创建或更新 harness**：根据检测结果决定操作。

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

# 检测 docs 目录结构
test -d docs && echo "docs 目录存在"
test -f docs/DESIGN.md && echo "docs/DESIGN.md 存在"
test -f docs/ARCHITECTURE.md && echo "docs/ARCHITECTURE.md 存在"
```

**判断结果：**
- 如果 `project-state/features.json` 不存在 → 新项目，创建完整结构
- 如果 `project-state/features.json` 已存在 → 已有项目，只添加新功能
- 如果 `project-state/features.json` 不存在但有其他文档 → 已有项目无 harness 结构，基于现有信息创建

## 信息收集机制

### 信息缺失检测

在 harness 创建过程中，检测以下信息是否完整：

1. **项目基本信息**
   - 项目名称
   - 项目描述
   - 技术栈
   - 架构模式

2. **功能信息**
   - 主要功能模块
   - 功能依赖关系
   - 优先级排序

3. **治理信息**
   - 团队角色
   - 审批流程
   - 质量标准

4. **运维信息**
   - 部署方式
   - 监控要求
   - 故障处理流程

### 智能提问策略

当检测到信息缺失时，采用以下策略：

1. **从现有文档提取**
   - 读取 README.md、package.json、docs/ 等
   - 分析 git 历史提交信息
   - 检查现有配置文件

2. **从代码库分析**
   - 分析代码结构推断架构
   - 从依赖推断技术栈
   - 从注释提取设计意图

3. **向用户提问**
   - 优先使用选择题，减少用户输入负担
   - 每次只问一个问题
   - 提供合理的默认选项
   - 记录用户回答到文档中

### 提问场景示例

**场景一：项目名称不明确**
- 从 package.json 读取 "name" 字段
- 从 README.md 提取标题
- 如果都没有：提问 "请提供项目名称"

**场景二：技术栈不明确**
- 从 package.json 分析依赖
- 从配置文件推断框架
- 如果推断不明确：提问 "项目主要使用什么技术栈？"
  选项：["React + Node.js", "Vue + Python", "其他（请说明）"]

**场景三：架构模式不明确**
- 从目录结构推断架构
- 从代码模式识别架构风格
- 如果推断不明确：提问 "项目采用什么架构模式？"
  选项：["单体应用", "微服务", "Serverless", "其他（请说明）"]

**场景四：功能模块不明确**
- 从代码目录识别模块
- 从 git 历史分析功能演进
- 如果推断不明确：提问 "请列出项目的主要功能模块"

### 信息补充到文档

当用户回答问题后，将信息补充到对应文档：

1. **基本信息** → `ARCHITECTURE.md`
   - 项目名称、描述、技术栈

2. **功能信息** → `project-state/features.json`
   - 功能模块、依赖关系、优先级

3. **治理信息** → `PRODUCT_SENSE.md`
   - 团队角色、审批流程、质量标准

4. **运维信息** → `RELIABILITY.md`
   - 部署方式、监控要求、故障处理

## 五子系统模型

### 1. 指令子系统

**最小工件：** `AGENTS.md`

**用途：** 启动路径、工作规则、完成定义

**要求：**
- 极简入口（~50行）
- 只包含路由和不变量
- 指向详细文档

**创建模板：**

```markdown
# 项目代理指令

## 快速导航
- 架构详情：`ARCHITECTURE.md`
- 设计文档：`docs/DESIGN.md`
- 执行计划：`docs/exec-plans/`
- 产品规格：`docs/product-specs/`
- 参考材料：`docs/references/`

## 工作流程
1. **初始化**
   - 阅读 ARCHITECTURE.md 了解系统架构
   - 阅读当前执行计划了解任务
   - 运行 init.sh 验证环境

2. **执行**
   - 一次只做一个有边界任务
   - 遵循架构设计原则
   - 更新执行计划和进度

3. **验证**
   - 运行验证命令
   - 收集验证证据
   - 更新质量评分

4. **完成**
   - 确认完成定义满足
   - 生成 session-handoff.md
   - 记录技术债（如有）

## 完成定义
1. 目标行为已实现
2. 验证运行通过
3. 证据已挂载
4. 文档已更新
5. 可以干净重启

## 不变量
- 仓库是唯一事实来源
- 验证证据比自信更重要
- 一次做好一个有边界任务
- 反复出现的人类反馈升级成 harness 规则
```

### 2. 状态子系统

**最小工件：** `project-state/features.json`, `progress.md`

**用途：** 当前功能、状态、证据、下一步

**features.json 结构：**

```json
{
  "project_name": "项目名称",
  "version": "1.0.0",
  "created_at": "2026-07-02",
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
      "tags": ["core", "api"],
      "verification_evidence": [],
      "quality_score": null
    }
  ],
  "completed_features": [],
  "technical_debt": []
}
```

**功能状态流转：**

```
planning → planned → in_progress → testing → completed
    ↓         ↓           ↓           ↓
  backlog  blocked     blocked     failed
```

### 3. 验证子系统

**最小工件：** `init.sh` 或文档化命令

**用途：** 测试/检查 agent 完成前必须运行

**init.sh 模板：**

```bash
#!/bin/bash
# 项目初始化和验证脚本

set -e

echo "开始验证项目环境..."

# 1. 检查依赖
echo "检查依赖..."
if [ -f "package.json" ]; then
    npm install
elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
elif [ -f "Cargo.toml" ]; then
    cargo build
fi

# 2. 运行测试
echo "运行测试..."
if [ -f "package.json" ]; then
    npm test
elif [ -f "pytest.ini" ]; then
    pytest
elif [ -f "Cargo.toml" ]; then
    cargo test
fi

# 3. 运行 lint
echo "运行 lint..."
if [ -f ".eslintrc.js" ]; then
    npm run lint
elif [ -f "ruff.toml" ]; then
    ruff check .
elif [ -f "clippy.toml" ]; then
    cargo clippy
fi

# 4. 运行类型检查
echo "运行类型检查..."
if [ -f "tsconfig.json" ]; then
    npm run typecheck
elif [ -f "mypy.ini" ]; then
    mypy .
fi

echo "验证完成！"
```

### 4. 范围子系统

**最小工件：** 功能依赖和完成标准

**用途：** 防止过度开发和半成品

**范围控制规则：**

1. **一次只做一个有边界任务**
   - 不在当前任务中添加未计划的功能
   - 发现新需求时记录到技术债跟踪表

2. **功能依赖管理**
   - 在 features.json 中记录依赖关系
   - 依赖未完成时标记为 blocked

3. **完成标准明确**
   - 每个功能有明确的验收标准
   - 完成定义包含所有验证步骤

### 5. 生命周期子系统

**最小工件：** `session-handoff.md`

**用途：** 使下一次会话可重启

**session-handoff.md 模板：**

```markdown
# 会话交接文档

## 当前状态
- **日期**: YYYY-MM-DD
- **当前功能**: feature-001
- **当前状态**: in_progress
- **当前任务**: 正在实现用户认证模块

## 已完成工作
1. 创建了项目结构
2. 实现了基础 API 框架
3. 设置了数据库连接

## 下一步
1. 实现用户注册功能
2. 添加密码加密
3. 编写单元测试

## 开放问题
1. 是否需要支持 OAuth？
2. 密码策略是什么？

## 技术债
1. 需要添加错误处理
2. 需要优化数据库查询

## 验证状态
- 测试通过率: 85%
- Lint 状态: 通过
- 类型检查: 通过
```

## 生产级文档体系

### 文档目录结构

```
docs/
├── DESIGN.md                    # 设计文档入口
├── FRONTEND.md                  # 前端治理规则
├── PLANS.md                     # 计划生命周期管理
├── PRODUCT_SENSE.md             # 产品判断与核心原则
├── QUALITY_SCORE.md             # 质量评分跟踪
├── RELIABILITY.md               # 可靠性定义与运行信号
├── SECURITY.md                  # 安全规则
├── design-docs/                 # 设计文档库
│   ├── index.md
│   └── core-beliefs.md
├── exec-plans/                  # 执行计划管理
│   ├── active/
│   ├── completed/
│   └── tech-debt-tracker.md
├── product-specs/               # 产品规格
│   ├── index.md
│   └── *.md
└── references/                  # 面向模型的参考材料
    └── *.txt
```

### 文档内容要求

**每个文档必须包含具体内容，不能只是空壳：**

1. **DESIGN.md** - 设计文档入口
   - 设计文档地图
   - 维护规则
   - Accepted/Proposed/Deprecated 分类

2. **FRONTEND.md** - 前端治理规则
   - UI 原则
   - 护栏
   - 验证要求

3. **PLANS.md** - 计划生命周期管理
   - 何时必须创建计划
   - 计划存放位置
   - 计划最少包含的部分
   - 运行规则

4. **PRODUCT_SENSE.md** - 产品判断与核心原则
   - 产品核心
   - 产品规则
   - 禁区模式

5. **QUALITY_SCORE.md** - 质量评分跟踪
   - 评级标准
   - 产品领域健康度
   - Benchmark 快照
   - 简化实验日志

6. **RELIABILITY.md** - 可靠性定义与运行信号
   - 标准路径
   - 必需运行信号
   - 黄金旅程
   - 可靠性规则

7. **SECURITY.md** - 安全规则
   - Secrets 与凭证规则
   - 不可信输入处理
   - 外部动作审批规则
   - 依赖与评审规则

## 工作流程

### 流程一：新项目初始化

```
1. 检测项目状态
   ├── 检查是否存在 harness 结构
   ├── 分析项目类型（前端/后端/全栈）
   └── 评估项目规模

2. 收集项目信息
   ├── 从现有文档提取信息
   ├── 从代码库分析推断信息
   └── 向用户提问补充缺失信息

3. 生成 harness 结构
   ├── 创建五子系统工件
   │   ├── 指令：AGENTS.md（路由式）
   │   ├── 状态：project-state/features.json
   │   ├── 验证：init.sh 验证脚本
   │   ├── 范围：功能依赖和完成标准
   │   └── 生命周期：session-handoff.md
   ├── 创建文档体系
   │   ├── ARCHITECTURE.md（分层架构）
   │   ├── docs/ 目录结构
   │   └── 治理文件（SECURITY.md 等）
   └── 生成初始执行计划

4. 验证 harness 质量
   ├── 运行验证脚本确保结构完整
   ├── 检查所有文档都有具体内容
   └── 确保所有文件可正常访问
```

### 流程二：已有项目新增功能

```
1. 检测现有 harness
   ├── 验证 project-state/features.json 存在
   ├── 读取现有功能列表
   └── 检查当前执行计划状态

2. 添加新功能
   ├── 在 features.json 中添加新功能条目
   ├── 创建新的执行计划文件
   │   └── docs/exec-plans/active/YYYY-MM-DD-<feature>.md
   └── 更新相关文档索引

3. 集成到现有工作流
   ├── 更新 AGENTS.md 路由（如需要）
   ├── 同步更新 ARCHITECTURE.md（如涉及架构变更）
   └── 记录技术债（如发现新的技术债）
```

### 流程三：已有项目无 harness 结构

```
1. 分析项目现有信息
   ├── 读取 README.md、package.json 等配置文件
   ├── 分析 git 历史提交信息
   ├── 识别项目技术栈和架构模式
   └── 提取项目描述和模块信息

2. 生成匹配的 harness 结构
   ├── 基于分析结果创建文档
   │   ├── ARCHITECTURE.md（基于实际架构）
   │   ├── PRODUCT_SENSE.md（基于项目目标）
   │   └── 其他治理文件
   ├── 创建项目状态管理
   │   └── project-state/features.json（基于现有功能）
   └── 生成初始执行计划（基于待开发功能）

3. 验证和调整
   ├── 运行验证脚本确保结构完整
   ├── 检查生成的文档是否符合项目实际
   └── 调整不匹配的部分
```

### 流程四：持续治理流程

```
1. 状态跟踪
   ├── 更新功能状态：planning → planned → in_progress → testing → completed
   ├── 记录执行进度和证据
   └── 管理技术债

2. 质量验证
   ├── 运行验证命令（测试、lint、类型检查）
   ├── 收集验证证据
   └── 更新质量评分

3. 会话交接
   ├── 生成 session-handoff.md
   ├── 记录当前状态和下一步
   └── 确保下一次会话可重启

4. 完成定义检查
   ├── 目标行为已实现
   ├── 验证运行通过
   ├── 证据已挂载
   ├── 文档已更新
   └── 可以干净重启
```

## 验证机制

### 五子系统验证

在 harness 创建完成后，验证五子系统完整性：

1. **指令子系统验证**
   - AGENTS.md 存在且内容完整
   - 包含工作流程和完成定义
   - 指向正确的文档路径

2. **状态子系统验证**
   - project-state/features.json 存在且格式正确
   - 包含至少一个功能条目
   - 状态流转定义清晰

3. **验证子系统验证**
   - init.sh 存在且可执行
   - 包含必要的验证步骤
   - 验证命令可正常运行

4. **范围子系统验证**
   - 功能依赖关系清晰
   - 完成标准明确
   - 防止过度开发的机制

5. **生命周期子系统验证**
   - session-handoff.md 模板存在
   - 包含必要的交接信息
   - 支持跨会话连续性

### 质量评分

使用以下标准评估 harness 质量：

| 维度 | 评分标准 |
|------|----------|
| **完整性** | 所有文档都有具体内容，没有空壳 |
| **可执行性** | 所有验证命令可正常运行 |
| **一致性** | 文档间信息一致，没有矛盾 |
| **可操作性** | 所有文档都有具体可执行的内容 |
| **生产级** | 符合生产级最佳实践 |

**评级标准：**
- **A**：完全符合生产级标准
- **B**：基本符合，有少量改进空间
- **C**：符合基本要求，需要显著改进
- **D**：不符合要求，需要重大改进

## 可交付清单

确保目标项目包含以下文件：

**五子系统工件：**
- [ ] `AGENTS.md`（指令子系统）
- [ ] `project-state/features.json`（状态子系统）
- [ ] `init.sh`（验证子系统）
- [ ] `session-handoff.md`（生命周期子系统）

**核心文件：**
- [ ] `ARCHITECTURE.md`（架构设计文档）

**文档体系：**
- [ ] `docs/DESIGN.md`（设计文档入口）
- [ ] `docs/FRONTEND.md`（前端治理规则）
- [ ] `docs/PLANS.md`（计划生命周期管理）
- [ ] `docs/PRODUCT_SENSE.md`（产品判断与核心原则）
- [ ] `docs/QUALITY_SCORE.md`（质量评分跟踪）
- [ ] `docs/RELIABILITY.md`（可靠性定义与运行信号）
- [ ] `docs/SECURITY.md`（安全规则）

**文档目录：**
- [ ] `docs/design-docs/`（设计文档库）
- [ ] `docs/exec-plans/active/`（活跃执行计划）
- [ ] `docs/exec-plans/completed/`（已完成计划）
- [ ] `docs/exec-plans/tech-debt-tracker.md`（技术债跟踪）
- [ ] `docs/product-specs/`（产品规格目录）
- [ ] `docs/references/`（参考材料目录）

## 常见问题

### 何时使用大型项目 harness？

- 项目包含多个模块
- 开发周期长（超过 2 周）
- 需要复杂治理结构
- 多人团队开发
- 长期演化项目
- 生产级项目管理

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

### 如何处理信息缺失？

1. **自动检测**：从现有文档和代码库提取信息
2. **智能提问**：向用户提问补充缺失信息
3. **文档补充**：将信息补充到对应文档中

### 如何确保文档质量？

1. **内容检查**：每个文档都有具体内容
2. **一致性检查**：文档间信息一致
3. **可执行检查**：验证命令可正常运行
4. **定期审查**：定期审查文档质量

## 参考材料

### 参考材料目录

`templates/docs/references/` 目录包含面向模型的参考材料：

1. **design-system-reference-llms.txt** - 设计系统参考
   - 组件命名规则
   - 间距字体 token
   - 状态变体
   - 可访问性要求

2. **nixpacks-llms.txt** - 部署参考
   - Build 入口
   - Runtime 假设
   - 环境变量要求
   - 常见失败特征

3. **uv-llms.txt** - Python 包管理参考
   - Install/sync 命令
   - Lockfile 策略
   - Virtualenv 约定
   - Verification 命令

### 使用参考材料

```bash
# 查看参考材料
cat templates/docs/references/design-system-reference-llms.txt

# 复制参考材料到项目
cp templates/docs/references/*.txt your-project/docs/references/
```

## 脚本工具

### 脚本目录

`templates/scripts/` 目录包含验证和评分脚本：

1. **init.sh** - 项目初始化和验证脚本
   - 检查依赖
   - 运行测试
   - 运行 lint
   - 运行类型检查
   - 检查 harness 结构
   - 生成验证报告

2. **validate-harness.mjs** - Harness 验证脚本
   - 验证五子系统完整性
   - 检查文档内容质量
   - 生成验证报告

3. **score-harness.mjs** - Harness 评分脚本
   - 评估 harness 质量
   - 计算质量评分
   - 生成改进建议

### 使用脚本

```bash
# 运行初始化脚本
bash templates/scripts/init.sh

# 运行验证脚本
node templates/scripts/validate-harness.mjs

# 运行评分脚本
node templates/scripts/score-harness.mjs

# 复制脚本到项目
cp templates/scripts/*.sh your-project/
cp templates/scripts/*.mjs your-project/
```

### 脚本功能

#### init.sh 功能
- 自动检测项目类型（Node.js/Python/Rust/Go）
- 安装依赖
- 运行测试套件
- 运行代码质量检查
- 检查 harness 结构完整性
- 生成详细的验证报告

#### validate-harness.mjs 功能
- 验证指令子系统（AGENTS.md）
- 验证状态子系统（features.json）
- 验证验证子系统（init.sh）
- 验证范围子系统（tech-debt-tracker.md）
- 验证生命周期子系统（session-handoff.md）
- 验证文档体系完整性

#### score-harness.mjs 功能
- 评估完整性（25%权重）
- 评估内容质量（30%权重）
- 评估验证机制（20%权重）
- 评估文档体系（15%权重）
- 评估生产就绪度（10%权重）
- 生成质量等级（A/B/C/D）

## 模板文件

### 模板目录结构

```
templates/
├── docs/                    # 文档模板
│   ├── DESIGN.md
│   ├── FRONTEND.md
│   ├── PLANS.md
│   ├── PRODUCT_SENSE.md
│   ├── QUALITY_SCORE.md
│   ├── RELIABILITY.md
│   ├── SECURITY.md
│   ├── design-docs/
│   │   ├── index.md
│   │   └── core-beliefs.md
│   ├── exec-plans/
│   │   ├── active/
│   │   │   └── index.md
│   │   ├── completed/
│   │   │   └── index.md
│   │   └── tech-debt-tracker.md
│   ├── product-specs/
│   │   ├── index.md
│   │   └── new-user-onboarding.md
│   └── references/
│       ├── index.md
│       ├── design-system-reference-llms.txt
│       ├── nixpacks-llms.txt
│       └── uv-llms.txt
└── scripts/                 # 脚本模板
    ├── init.sh
    ├── validate-harness.mjs
    └── score-harness.mjs
```

### 使用模板

```bash
# 复制所有模板到项目
cp -r templates/* your-project/

# 复制特定模板
cp templates/docs/DESIGN.md your-project/docs/
cp templates/scripts/init.sh your-project/
```

### 自定义模板

可以根据项目需求自定义模板：

1. **修改文档模板**
   - 编辑 `templates/docs/` 下的文件
   - 根据项目需求调整内容
   - 保持模板格式一致

2. **修改脚本模板**
   - 编辑 `templates/scripts/` 下的文件
   - 根据项目技术栈调整检查逻辑
   - 添加自定义验证步骤
