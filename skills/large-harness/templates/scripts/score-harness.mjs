#!/usr/bin/env node

/**
 * Harness 评分脚本
 * 评估项目 harness 质量并生成评分报告
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 评分维度
const dimensions = {
  completeness: {
    name: '完整性',
    weight: 0.25,
    items: [
      { name: 'AGENTS.md 存在', check: (dir) => existsSync(join(dir, 'AGENTS.md')) },
      { name: 'ARCHITECTURE.md 存在', check: (dir) => existsSync(join(dir, 'ARCHITECTURE.md')) },
      { name: 'project-state 目录存在', check: (dir) => existsSync(join(dir, 'project-state')) },
      { name: 'features.json 存在', check: (dir) => existsSync(join(dir, 'project-state', 'features.json')) },
      { name: 'docs 目录存在', check: (dir) => existsSync(join(dir, 'docs')) },
      { name: 'docs/DESIGN.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'DESIGN.md')) },
      { name: 'docs/FRONTEND.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'FRONTEND.md')) },
      { name: 'docs/PLANS.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'PLANS.md')) },
      { name: 'docs/PRODUCT_SENSE.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'PRODUCT_SENSE.md')) },
      { name: 'docs/QUALITY_SCORE.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'QUALITY_SCORE.md')) },
      { name: 'docs/RELIABILITY.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'RELIABILITY.md')) },
      { name: 'docs/SECURITY.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'SECURITY.md')) },
      { name: 'init.sh 存在', check: (dir) => existsSync(join(dir, 'init.sh')) },
      { name: 'session-handoff.md 存在', check: (dir) => existsSync(join(dir, 'session-handoff.md')) }
    ]
  },
  contentQuality: {
    name: '内容质量',
    weight: 0.30,
    items: [
      { name: 'AGENTS.md 内容完整', check: (dir) => checkFileHasContent(dir, 'AGENTS.md', ['项目代理指令', '快速导航', '工作规则', '完成定义']) },
      { name: 'ARCHITECTURE.md 内容完整', check: (dir) => checkFileHasContent(dir, 'ARCHITECTURE.md', ['系统架构', '技术栈', '模块']) },
      { name: 'features.json 结构正确', check: (dir) => checkFeaturesJsonStructure(dir) },
      { name: 'docs/DESIGN.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/DESIGN.md', ['设计文档', 'Accepted', 'Proposed', 'Deprecated']) },
      { name: 'docs/FRONTEND.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/FRONTEND.md', ['UI 原则', '护栏', '验证要求']) },
      { name: 'docs/PLANS.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/PLANS.md', ['计划生命周期', '何时必须创建计划', '计划存放位置']) },
      { name: 'docs/PRODUCT_SENSE.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/PRODUCT_SENSE.md', ['产品核心', '产品规则', '禁区模式']) },
      { name: 'docs/QUALITY_SCORE.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/QUALITY_SCORE.md', ['评级标准', '产品领域健康度', 'Benchmark 快照']) },
      { name: 'docs/RELIABILITY.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/RELIABILITY.md', ['标准路径', '必需运行信号', '黄金旅程']) },
      { name: 'docs/SECURITY.md 内容完整', check: (dir) => checkFileHasContent(dir, 'docs/SECURITY.md', ['Secrets', '凭证规则', '不可信输入']) }
    ]
  },
  verification: {
    name: '验证机制',
    weight: 0.20,
    items: [
      { name: 'init.sh 可执行', check: (dir) => checkFileExecutable(dir, 'init.sh') },
      { name: 'init.sh 包含依赖检查', check: (dir) => checkFileHasContent(dir, 'init.sh', ['检查依赖', 'npm install', 'pip install']) },
      { name: 'init.sh 包含测试运行', check: (dir) => checkFileHasContent(dir, 'init.sh', ['运行测试', 'npm test', 'pytest']) },
      { name: 'init.sh 包含 lint 检查', check: (dir) => checkFileHasContent(dir, 'init.sh', ['运行 lint', 'eslint', 'ruff']) },
      { name: 'init.sh 包含类型检查', check: (dir) => checkFileHasContent(dir, 'init.sh', ['类型检查', 'typecheck', 'mypy']) }
    ]
  },
  documentation: {
    name: '文档体系',
    weight: 0.15,
    items: [
      { name: 'docs/design-docs 目录存在', check: (dir) => existsSync(join(dir, 'docs', 'design-docs')) },
      { name: 'docs/design-docs/index.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'design-docs', 'index.md')) },
      { name: 'docs/design-docs/core-beliefs.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'design-docs', 'core-beliefs.md')) },
      { name: 'docs/exec-plans 目录存在', check: (dir) => existsSync(join(dir, 'docs', 'exec-plans')) },
      { name: 'docs/exec-plans/active 目录存在', check: (dir) => existsSync(join(dir, 'docs', 'exec-plans', 'active')) },
      { name: 'docs/exec-plans/completed 目录存在', check: (dir) => existsSync(join(dir, 'docs', 'exec-plans', 'completed')) },
      { name: 'docs/exec-plans/tech-debt-tracker.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'exec-plans', 'tech-debt-tracker.md')) },
      { name: 'docs/product-specs 目录存在', check: (dir) => existsSync(join(dir, 'docs', 'product-specs')) },
      { name: 'docs/product-specs/index.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'product-specs', 'index.md')) },
      { name: 'docs/references 目录存在', check: (dir) => existsSync(join(dir, 'docs', 'references')) },
      { name: 'docs/references/index.md 存在', check: (dir) => existsSync(join(dir, 'docs', 'references', 'index.md')) }
    ]
  },
  productionReadiness: {
    name: '生产就绪',
    weight: 0.10,
    items: [
      { name: 'AGENTS.md 包含工作流程', check: (dir) => checkFileHasContent(dir, 'AGENTS.md', ['工作流程', '初始化', '执行', '验证', '完成']) },
      { name: 'AGENTS.md 包含完成定义', check: (dir) => checkFileHasContent(dir, 'AGENTS.md', ['完成定义', '目标行为', '验证运行', '证据']) },
      { name: 'AGENTS.md 包含不变量', check: (dir) => checkFileHasContent(dir, 'AGENTS.md', ['不变量', '仓库是唯一事实来源', '验证证据比自信更重要']) },
      { name: 'docs/RELIABILITY.md 包含黄金旅程', check: (dir) => checkFileHasContent(dir, 'docs/RELIABILITY.md', ['黄金旅程', '关键用户路径', '可重复验证']) },
      { name: 'docs/SECURITY.md 包含安全规则', check: (dir) => checkFileHasContent(dir, 'docs/SECURITY.md', ['安全规则', '不硬编码', '凭证']) }
    ]
  }
};

// 检查文件是否有内容
function checkFileHasContent(dir, fileName, requiredContent) {
  const filePath = join(dir, fileName);
  if (!existsSync(filePath)) return false;
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    return requiredContent.every(item => content.includes(item));
  } catch (error) {
    return false;
  }
}

// 检查文件是否可执行
function checkFileExecutable(dir, fileName) {
  const filePath = join(dir, fileName);
  if (!existsSync(filePath)) return false;
  
  try {
    const { statSync } = await import('fs');
    const stat = statSync(filePath);
    return !!(stat.mode & 0o111);
  } catch (error) {
    return false;
  }
}

// 检查 features.json 结构
function checkFeaturesJsonStructure(dir) {
  const filePath = join(dir, 'project-state', 'features.json');
  if (!existsSync(filePath)) return false;
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    return (
      data.project_name &&
      data.version &&
      Array.isArray(data.features) &&
      data.features.every(feature => 
        feature.id && feature.name && feature.status && feature.priority
      )
    );
  } catch (error) {
    return false;
  }
}

// 评估维度得分
function evaluateDimension(dimension, projectDir) {
  const passed = dimension.items.filter(item => item.check(projectDir)).length;
  const total = dimension.items.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  
  return {
    name: dimension.name,
    passed,
    total,
    score,
    weight: dimension.weight,
    weightedScore: Math.round(score * dimension.weight)
  };
}

// 主评分函数
function scoreHarness(projectDir) {
  console.log('开始评估 harness 质量...\n');
  
  const dimensionResults = [];
  let totalWeightedScore = 0;
  
  for (const [key, dimension] of Object.entries(dimensions)) {
    const result = evaluateDimension(dimension, projectDir);
    dimensionResults.push(result);
    totalWeightedScore += result.weightedScore;
    
    console.log(`${result.name}: ${result.score}% (${result.passed}/${result.total})`);
  }
  
  // 计算总分
  const totalScore = totalWeightedScore;
  
  // 确定等级
  let grade;
  if (totalScore >= 90) grade = 'A';
  else if (totalScore >= 80) grade = 'B';
  else if (totalScore >= 70) grade = 'C';
  else grade = 'D';
  
  console.log(`\n总分: ${totalScore}%`);
  console.log(`等级: ${grade}`);
  
  // 生成报告
  const report = {
    projectDir,
    timestamp: new Date().toISOString(),
    dimensions: dimensionResults,
    totalScore,
    grade,
    summary: {
      passed: dimensionResults.reduce((sum, d) => sum + d.passed, 0),
      total: dimensionResults.reduce((sum, d) => sum + d.total, 0)
    },
    recommendations: generateRecommendations(dimensionResults)
  };
  
  return report;
}

// 生成改进建议
function generateRecommendations(dimensionResults) {
  const recommendations = [];
  
  for (const dimension of dimensionResults) {
    if (dimension.score < 80) {
      const failedItems = dimension.items.filter((item, index) => {
        // 这里简化处理，实际应该重新检查
        return index < dimension.total - dimension.passed;
      });
      
      recommendations.push({
        dimension: dimension.name,
        score: dimension.score,
        suggestion: `提升${dimension.name}得分，当前${dimension.score}%，目标80%以上`
      });
    }
  }
  
  return recommendations;
}

// 命令行接口
const projectDir = process.argv[2] || process.cwd();
console.log(`评估目录: ${projectDir}\n`);

const report = scoreHarness(projectDir);

// 保存报告
const reportFile = join(projectDir, `harness-quality-report-${Date.now()}.json`);
writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(`\n报告已保存到: ${reportFile}`);

// 输出详细结果
console.log('\n=== 详细结果 ===');
for (const dimension of report.dimensions) {
  console.log(`\n${dimension.name}:`);
  console.log(`  得分: ${dimension.score}%`);
  console.log(`  通过: ${dimension.passed}/${dimension.total}`);
  console.log(`  权重: ${dimension.weight * 100}%`);
  console.log(`  加权得分: ${dimension.weightedScore}%`);
}

// 输出改进建议
if (report.recommendations.length > 0) {
  console.log('\n=== 改进建议 ===');
  for (const rec of report.recommendations) {
    console.log(`- ${rec.suggestion}`);
  }
}

// 退出码
process.exit(report.totalScore < 70 ? 1 : 0);
