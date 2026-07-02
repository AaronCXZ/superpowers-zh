#!/usr/bin/env node

/**
 * Harness 验证脚本
 * 验证项目 harness 结构的完整性和质量
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 验证结果收集
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

// 添加验证结果
function addResult(category, name, passed, message, isWarning = false) {
  const status = passed ? '✓' : (isWarning ? '⚠' : '✗');
  const result = { category, name, passed, message, isWarning };
  results.details.push(result);
  
  if (passed) {
    results.passed++;
  } else if (isWarning) {
    results.warnings++;
  } else {
    results.failed++;
  }
  
  console.log(`${status} ${category}: ${name} - ${message}`);
}

// 检查文件是否存在
function checkFileExists(filePath, name, category) {
  if (existsSync(filePath)) {
    addResult(category, name, true, '文件存在');
    return true;
  } else {
    addResult(category, name, false, '文件不存在');
    return false;
  }
}

// 检查目录是否存在
function checkDirExists(dirPath, name, category) {
  if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
    addResult(category, name, true, '目录存在');
    return true;
  } else {
    addResult(category, name, false, '目录不存在');
    return false;
  }
}

// 检查文件内容
function checkFileContent(filePath, name, category, requiredContent) {
  if (!checkFileExists(filePath, name, category)) {
    return false;
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    for (const item of requiredContent) {
      if (typeof item === 'string') {
        if (!content.includes(item)) {
          addResult(category, `${name} 内容检查`, false, `缺少必需内容: ${item}`);
          return false;
        }
      } else if (item instanceof RegExp) {
        if (!item.test(content)) {
          addResult(category, `${name} 内容检查`, false, `内容不符合正则表达式: ${item}`);
          return false;
        }
      }
    }
    
    addResult(category, `${name} 内容检查`, true, '内容完整');
    return true;
  } catch (error) {
    addResult(category, `${name} 内容检查`, false, `读取文件失败: ${error.message}`);
    return false;
  }
}

// 检查 features.json 结构
function checkFeaturesJson(filePath) {
  if (!checkFileExists(filePath, 'features.json', '状态子系统')) {
    return false;
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // 检查必需字段
    const requiredFields = ['project_name', 'version', 'features'];
    for (const field of requiredFields) {
      if (!data[field]) {
        addResult('状态子系统', 'features.json 结构检查', false, `缺少必需字段: ${field}`);
        return false;
      }
    }
    
    // 检查 features 数组
    if (!Array.isArray(data.features)) {
      addResult('状态子系统', 'features.json 结构检查', false, 'features 不是数组');
      return false;
    }
    
    // 检查每个 feature 的结构
    for (const feature of data.features) {
      const featureRequiredFields = ['id', 'name', 'status', 'priority'];
      for (const field of featureRequiredFields) {
        if (!feature[field]) {
          addResult('状态子系统', 'features.json 结构检查', false, `feature 缺少必需字段: ${field}`);
          return false;
        }
      }
    }
    
    addResult('状态子系统', 'features.json 结构检查', true, '结构正确');
    return true;
  } catch (error) {
    addResult('状态子系统', 'features.json 结构检查', false, `解析 JSON 失败: ${error.message}`);
    return false;
  }
}

// 检查 init.sh 可执行性
function checkInitShExecutable(filePath) {
  if (!checkFileExists(filePath, 'init.sh', '验证子系统')) {
    return false;
  }
  
  try {
    const stat = statSync(filePath);
    // 检查文件权限（简化检查）
    if (stat.mode & 0o111) {
      addResult('验证子系统', 'init.sh 可执行性检查', true, '文件可执行');
      return true;
    } else {
      addResult('验证子系统', 'init.sh 可执行性检查', false, '文件不可执行');
      return false;
    }
  } catch (error) {
    addResult('验证子系统', 'init.sh 可执行性检查', false, `检查文件权限失败: ${error.message}`);
    return false;
  }
}

// 主验证函数
function validateHarness(projectDir) {
  console.log('开始验证 harness 结构...\n');
  
  // 1. 验证指令子系统
  console.log('=== 指令子系统 ===');
  checkFileExists(join(projectDir, 'AGENTS.md'), 'AGENTS.md', '指令子系统');
  checkFileContent(join(projectDir, 'AGENTS.md'), 'AGENTS.md', '指令子系统', [
    '项目代理指令',
    '快速导航',
    '工作规则',
    '完成定义'
  ]);
  
  // 2. 验证状态子系统
  console.log('\n=== 状态子系统 ===');
  checkDirExists(join(projectDir, 'project-state'), 'project-state 目录', '状态子系统');
  checkFeaturesJson(join(projectDir, 'project-state', 'features.json'));
  
  // 3. 验证验证子系统
  console.log('\n=== 验证子系统 ===');
  checkInitShExecutable(join(projectDir, 'init.sh'));
  checkFileContent(join(projectDir, 'init.sh'), 'init.sh', '验证子系统', [
    '检查依赖',
    '运行测试',
    '运行 lint'
  ]);
  
  // 4. 验证范围子系统
  console.log('\n=== 范围子系统 ===');
  checkFileExists(join(projectDir, 'docs', 'exec-plans', 'tech-debt-tracker.md'), 'tech-debt-tracker.md', '范围子系统');
  
  // 5. 验证生命周期子系统
  console.log('\n=== 生命周期子系统 ===');
  checkFileExists(join(projectDir, 'session-handoff.md'), 'session-handoff.md', '生命周期子系统');
  
  // 6. 验证文档体系
  console.log('\n=== 文档体系 ===');
  checkDirExists(join(projectDir, 'docs'), 'docs 目录', '文档体系');
  checkFileExists(join(projectDir, 'ARCHITECTURE.md'), 'ARCHITECTURE.md', '文档体系');
  
  // 7. 验证治理文件
  console.log('\n=== 治理文件 ===');
  const governanceFiles = [
    'DESIGN.md',
    'FRONTEND.md',
    'PLANS.md',
    'PRODUCT_SENSE.md',
    'QUALITY_SCORE.md',
    'RELIABILITY.md',
    'SECURITY.md'
  ];
  
  for (const file of governanceFiles) {
    checkFileExists(join(projectDir, 'docs', file), file, '治理文件');
  }
  
  // 8. 验证文档目录
  console.log('\n=== 文档目录 ===');
  const docDirs = [
    'design-docs',
    'exec-plans/active',
    'exec-plans/completed',
    'product-specs',
    'references'
  ];
  
  for (const dir of docDirs) {
    checkDirExists(join(projectDir, 'docs', dir), dir, '文档目录');
  }
  
  // 9. 验证设计文档
  console.log('\n=== 设计文档 ===');
  checkFileExists(join(projectDir, 'docs', 'design-docs', 'index.md'), 'design-docs/index.md', '设计文档');
  checkFileExists(join(projectDir, 'docs', 'design-docs', 'core-beliefs.md'), 'design-docs/core-beliefs.md', '设计文档');
  
  // 10. 验证产品规格
  console.log('\n=== 产品规格 ===');
  checkFileExists(join(projectDir, 'docs', 'product-specs', 'index.md'), 'product-specs/index.md', '产品规格');
  
  // 11. 验证参考材料
  console.log('\n=== 参考材料 ===');
  checkFileExists(join(projectDir, 'docs', 'references', 'index.md'), 'references/index.md', '参考材料');
  
  // 生成报告
  console.log('\n=== 验证报告 ===');
  console.log(`通过: ${results.passed}`);
  console.log(`失败: ${results.failed}`);
  console.log(`警告: ${results.warnings}`);
  
  // 计算质量评分
  const total = results.passed + results.failed + results.warnings;
  const score = total > 0 ? Math.round((results.passed / total) * 100) : 0;
  
  let grade;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else grade = 'D';
  
  console.log(`\n质量评分: ${score}% (${grade}级)`);
  
  // 返回结果
  return {
    passed: results.passed,
    failed: results.failed,
    warnings: results.warnings,
    score,
    grade,
    details: results.details
  };
}

// 命令行接口
const projectDir = process.argv[2] || process.cwd();
console.log(`验证目录: ${projectDir}\n`);

const report = validateHarness(projectDir);

// 保存报告
const reportFile = join(projectDir, `harness-validation-report-${Date.now()}.json`);
import { writeFileSync } from 'fs';
writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(`\n报告已保存到: ${reportFile}`);

// 退出码
process.exit(report.failed > 0 ? 1 : 0);
