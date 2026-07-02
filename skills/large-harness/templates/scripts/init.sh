#!/bin/bash
# 项目初始化和验证脚本

set -e

echo "开始验证项目环境..."

# 1. 检查依赖
echo "检查依赖..."
if [ -f "package.json" ]; then
    echo "检测到 Node.js 项目"
    npm install
elif [ -f "requirements.txt" ]; then
    echo "检测到 Python 项目"
    pip install -r requirements.txt
elif [ -f "Cargo.toml" ]; then
    echo "检测到 Rust 项目"
    cargo build
elif [ -f "go.mod" ]; then
    echo "检测到 Go 项目"
    go mod download
else
    echo "未检测到已知项目类型"
fi

# 2. 运行测试
echo "运行测试..."
if [ -f "package.json" ]; then
    npm test
elif [ -f "pytest.ini" ] || [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
    pytest
elif [ -f "Cargo.toml" ]; then
    cargo test
elif [ -f "go.mod" ]; then
    go test ./...
fi

# 3. 运行 lint
echo "运行 lint..."
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc" ]; then
    npm run lint
elif [ -f "ruff.toml" ] || [ -f "pyproject.toml" ]; then
    ruff check .
elif [ -f "clippy.toml" ] || [ -f "Cargo.toml" ]; then
    cargo clippy
elif [ -f ".golangci.yml" ] || [ -f "go.mod" ]; then
    golangci-lint run
fi

# 4. 运行类型检查
echo "运行类型检查..."
if [ -f "tsconfig.json" ]; then
    npm run typecheck
elif [ -f "mypy.ini" ] || [ -f "setup.cfg" ]; then
    mypy .
elif [ -f "pyproject.toml" ]; then
    mypy .
fi

# 5. 检查代码格式
echo "检查代码格式..."
if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ]; then
    npm run format:check
elif [ -f "ruff.toml" ] || [ -f "pyproject.toml" ]; then
    ruff format --check .
elif [ -f "rustfmt.toml" ] || [ -f "Cargo.toml" ]; then
    cargo fmt --check
fi

# 6. 检查安全漏洞
echo "检查安全漏洞..."
if [ -f "package.json" ]; then
    npm audit
elif [ -f "requirements.txt" ]; then
    pip-audit
elif [ -f "Cargo.toml" ]; then
    cargo audit
fi

# 7. 生成覆盖率报告
echo "生成覆盖率报告..."
if [ -f "package.json" ]; then
    npm run coverage
elif [ -f "pytest.ini" ] || [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
    pytest --cov=.
elif [ -f "Cargo.toml" ]; then
    cargo tarpaulin
elif [ -f "go.mod" ]; then
    go test -coverprofile=coverage.out ./...
    go tool cover -html=coverage.out
fi

# 8. 检查 harness 结构
echo "检查 harness 结构..."
if [ -d "project-state" ]; then
    echo "✓ project-state 目录存在"
else
    echo "✗ project-state 目录不存在"
fi

if [ -f "project-state/features.json" ]; then
    echo "✓ features.json 存在"
else
    echo "✗ features.json 不存在"
fi

if [ -f "AGENTS.md" ]; then
    echo "✓ AGENTS.md 存在"
else
    echo "✗ AGENTS.md 不存在"
fi

if [ -f "ARCHITECTURE.md" ]; then
    echo "✓ ARCHITECTURE.md 存在"
else
    echo "✗ ARCHITECTURE.md 不存在"
fi

if [ -d "docs" ]; then
    echo "✓ docs 目录存在"
else
    echo "✗ docs 目录不存在"
fi

# 9. 检查文档完整性
echo "检查文档完整性..."
if [ -f "docs/DESIGN.md" ]; then
    echo "✓ docs/DESIGN.md 存在"
else
    echo "✗ docs/DESIGN.md 不存在"
fi

if [ -f "docs/FRONTEND.md" ]; then
    echo "✓ docs/FRONTEND.md 存在"
else
    echo "✗ docs/FRONTEND.md 不存在"
fi

if [ -f "docs/PLANS.md" ]; then
    echo "✓ docs/PLANS.md 存在"
else
    echo "✗ docs/PLANS.md 不存在"
fi

if [ -f "docs/PRODUCT_SENSE.md" ]; then
    echo "✓ docs/PRODUCT_SENSE.md 存在"
else
    echo "✗ docs/PRODUCT_SENSE.md 不存在"
fi

if [ -f "docs/QUALITY_SCORE.md" ]; then
    echo "✓ docs/QUALITY_SCORE.md 存在"
else
    echo "✗ docs/QUALITY_SCORE.md 不存在"
fi

if [ -f "docs/RELIABILITY.md" ]; then
    echo "✓ docs/RELIABILITY.md 存在"
else
    echo "✗ docs/RELIABILITY.md 不存在"
fi

if [ -f "docs/SECURITY.md" ]; then
    echo "✓ docs/SECURITY.md 存在"
else
    echo "✗ docs/SECURITY.md 不存在"
fi

# 10. 检查执行计划目录
echo "检查执行计划目录..."
if [ -d "docs/exec-plans" ]; then
    echo "✓ docs/exec-plans 目录存在"
else
    echo "✗ docs/exec-plans 目录不存在"
fi

if [ -d "docs/exec-plans/active" ]; then
    echo "✓ docs/exec-plans/active 目录存在"
else
    echo "✗ docs/exec-plans/active 目录不存在"
fi

if [ -d "docs/exec-plans/completed" ]; then
    echo "✓ docs/exec-plans/completed 目录存在"
else
    echo "✗ docs/exec-plans/completed 目录不存在"
fi

if [ -f "docs/exec-plans/tech-debt-tracker.md" ]; then
    echo "✓ docs/exec-plans/tech-debt-tracker.md 存在"
else
    echo "✗ docs/exec-plans/tech-debt-tracker.md 不存在"
fi

# 11. 检查设计文档目录
echo "检查设计文档目录..."
if [ -d "docs/design-docs" ]; then
    echo "✓ docs/design-docs 目录存在"
else
    echo "✗ docs/design-docs 目录不存在"
fi

if [ -f "docs/design-docs/index.md" ]; then
    echo "✓ docs/design-docs/index.md 存在"
else
    echo "✗ docs/design-docs/index.md 不存在"
fi

if [ -f "docs/design-docs/core-beliefs.md" ]; then
    echo "✓ docs/design-docs/core-beliefs.md 存在"
else
    echo "✗ docs/design-docs/core-beliefs.md 不存在"
fi

# 12. 检查产品规格目录
echo "检查产品规格目录..."
if [ -d "docs/product-specs" ]; then
    echo "✓ docs/product-specs 目录存在"
else
    echo "✗ docs/product-specs 目录不存在"
fi

if [ -f "docs/product-specs/index.md" ]; then
    echo "✓ docs/product-specs/index.md 存在"
else
    echo "✗ docs/product-specs/index.md 不存在"
fi

# 13. 检查参考材料目录
echo "检查参考材料目录..."
if [ -d "docs/references" ]; then
    echo "✓ docs/references 目录存在"
else
    echo "✗ docs/references 目录不存在"
fi

# 14. 生成验证报告
echo "生成验证报告..."
REPORT_FILE="validation-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# 验证报告

## 生成时间
$(date)

## 项目信息
- 项目目录: $(pwd)
- Node.js 版本: $(node --version 2>/dev/null || echo "未安装")
- Python 版本: $(python --version 2>/dev/null || echo "未安装")
- Rust 版本: $(rustc --version 2>/dev/null || echo "未安装")
- Go 版本: $(go version 2>/dev/null || echo "未安装")

## 验证结果
### 依赖检查
- [ ] 依赖安装成功

### 测试检查
- [ ] 测试通过

### Lint 检查
- [ ] Lint 通过

### 类型检查
- [ ] 类型检查通过

### 代码格式检查
- [ ] 代码格式正确

### 安全漏洞检查
- [ ] 无安全漏洞

### 覆盖率检查
- [ ] 覆盖率达标

### Harness 结构检查
- [ ] project-state 目录存在
- [ ] features.json 存在
- [ ] AGENTS.md 存在
- [ ] ARCHITECTURE.md 存在

### 文档完整性检查
- [ ] docs/DESIGN.md 存在
- [ ] docs/FRONTEND.md 存在
- [ ] docs/PLANS.md 存在
- [ ] docs/PRODUCT_SENSE.md 存在
- [ ] docs/QUALITY_SCORE.md 存在
- [ ] docs/RELIABILITY.md 存在
- [ ] docs/SECURITY.md 存在

### 执行计划目录检查
- [ ] docs/exec-plans 目录存在
- [ ] docs/exec-plans/active 目录存在
- [ ] docs/exec-plans/completed 目录存在
- [ ] docs/exec-plans/tech-debt-tracker.md 存在

### 设计文档目录检查
- [ ] docs/design-docs 目录存在
- [ ] docs/design-docs/index.md 存在
- [ ] docs/design-docs/core-beliefs.md 存在

### 产品规格目录检查
- [ ] docs/product-specs 目录存在
- [ ] docs/product-specs/index.md 存在

### 参考材料目录检查
- [ ] docs/references 目录存在

## 建议
- 确保所有验证项目都通过
- 定期运行此脚本检查项目状态
- 根据验证结果更新质量评分
EOF

echo "验证报告已生成: $REPORT_FILE"

echo "验证完成！"
