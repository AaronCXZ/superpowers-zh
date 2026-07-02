# 设计文档索引

## 目的
管理所有设计文档，分类为 Accepted、Proposed、Deprecated。

## Accepted（已接受）

### [核心信念](core-beliefs.md)
- **状态**: Accepted
- **日期**: 2026-07-02
- **摘要**: agent-first 核心信念

## Proposed（提议中）
- 无

## Deprecated（已弃用）
- 无

## 维护规则

### 1. 文档分类
- **Accepted**: 已接受的设计决策
- **Proposed**: 提议中的设计决策
- **Deprecated**: 已弃用的设计决策

### 2. 文档格式
```markdown
# [文档标题]

## 状态
- **分类**: Accepted/Proposed/Deprecated
- **日期**: YYYY-MM-DD
- **作者**: 作者名称

## 摘要
简短描述文档内容。

## 详细内容
[详细内容]
```

### 3. 文档更新
- 新增文档时更新此索引
- 文档状态变更时更新分类
- 文档弃用时移动到 Deprecated

### 4. 文档链接
- 使用相对路径链接文档
- 确保链接有效
- 定期检查链接状态
