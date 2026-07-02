# Large-Harness Skill 重构设计文档

## 概述

重构现有 large-harness skill，采用 D:\code\learn-harness-engineering\docs\zh\resources\openai-advanced 中的生产级模式，与 small-harness 拉开明显差距。

## 目标

1. **生产级治理**：从文档创建转向生产级治理框架
2. **五子系统模型**：指令、状态、验证、范围、生命周期
3. **智能信息收集**：支持自动检测和用户提问补充信息
4. **三种场景支持**：新项目、已有项目新增功能、已有项目无 harness 结构

## 设计决策

### 1. 采用生产级模式
- 参考 D:\code\learn-harness-engineering\docs\zh\resources\openai-advanced
- 整合五子系统模型和七种参考模式
- 提供完整的生产级治理框架

### 2. 分层路由架构
- AGENTS.md 作为极简入口（~50行）
- ARCHITECTURE.md 作为系统顶层地图
- docs/ 子文件包含深层规则

### 3. 智能信息收集
- 自动从现有文档和代码库提取信息
- 通过提问方式让用户补充缺失信息
- 将信息补充到对应文档中

## 核心组件

### 1. 五子系统模型

| 子系统 | 最小工件 | 用途 |
|--------|----------|------|
| 指令 | AGENTS.md | 启动路径、工作规则、完成定义 |
| 状态 | features.json, progress.md | 当前功能、状态、证据、下一步 |
| 验证 | init.sh 或文档化命令 | 测试/检查 agent 完成前必须运行 |
| 范围 | 功能依赖和完成标准 | 防止过度开发和半成品 |
| 生命周期 | session-handoff.md | 使下一次会话可重启 |

### 2. 生产级文档体系

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

### 3. 信息收集机制

#### 信息缺失检测
- 项目基本信息：名称、描述、技术栈、架构模式
- 功能信息：主要功能模块、依赖关系、优先级排序
- 治理信息：团队角色、审批流程、质量标准
- 运维信息：部署方式、监控要求、故障处理流程

#### 智能提问策略
1. 从现有文档提取信息
2. 从代码库分析推断信息
3. 向用户提问补充缺失信息

## 工作流程

### 流程一：新项目初始化
1. 检测项目状态
2. 生成 harness 结构
3. 验证 harness 质量

### 流程二：已有项目新增功能
1. 检测现有 harness
2. 添加新功能
3. 集成到现有工作流

### 流程三：已有项目无 harness 结构
1. 分析项目现有信息
2. 生成匹配的 harness 结构
3. 验证和调整

## 与 small-harness 的区别

| 方面 | small-harness | large-harness |
|------|---------------|---------------|
| 适用场景 | 小型项目 | 大型项目 |
| 文档结构 | 基本文档 | 生产级文档体系 |
| 状态管理 | feature_list.json | project-state/features.json + 多个治理文件 |
| 验证机制 | 基本验证 | 五子系统验证 + 质量评分 |
| 信息收集 | 手动输入 | 智能检测 + 用户提问 |

## 实现计划

### 阶段一：重构 SKILL.md
1. 重写 large-harness/SKILL.md
2. 整合五子系统模型
3. 添加智能信息收集机制

### 阶段二：创建模板文件
1. 创建 docs/ 目录模板
2. 创建治理文件模板
3. 创建验证脚本模板

### 阶段三：集成测试
1. 测试新项目初始化
2. 测试已有项目新增功能
3. 测试已有项目无 harness 结构

## 验证标准

1. **完整性**：所有文档都有具体内容
2. **可执行性**：所有验证命令可正常运行
3. **一致性**：文档间信息一致
4. **可操作性**：所有文档都有具体可执行的内容
