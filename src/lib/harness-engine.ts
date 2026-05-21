/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HarnessVariableSpec {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  description?: string;
  defaultValue?: string | number | boolean;
  required?: boolean;
  choices?: string[]; // For enum types
  regexPattern?: string; // Optional regex formatting rule
}

export interface HarnessEngineSchema {
  variables: HarnessVariableSpec[];
}

/** Type-safe variable value — harness variables are always scalar. */
export type HarnessVariableValue = string | number | boolean;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: Record<string, HarnessVariableValue>;
}

export class HarnessEngine {
  /**
   * Parses and validates user input variables against the harness schema.
   */
  static validateVariables(
    userInput: Record<string, unknown>,
    schemaJson: string | HarnessEngineSchema
  ): ValidationResult {
    const errors: Record<string, string> = {};
    const sanitized: Record<string, HarnessVariableValue> = {};

    let schema: HarnessEngineSchema;
    try {
      schema = typeof schemaJson === 'string' ? JSON.parse(schemaJson) : schemaJson;
    } catch {
      return { isValid: false, errors: { _schema: 'Invalid schema JSON format.' }, sanitized };
    }

    if (!schema || !Array.isArray(schema.variables)) {
      return { isValid: true, errors, sanitized: userInput as Record<string, HarnessVariableValue> };
    }

    for (const varSpec of schema.variables) {
      const value = userInput[varSpec.key];

      // Clean check nested values
      if (value === undefined || value === null || value === '') {
        if (varSpec.required) {
          errors[varSpec.key] = `The variable "${varSpec.label || varSpec.key}" is required.`;
        } else {
          sanitized[varSpec.key] = varSpec.defaultValue !== undefined ? varSpec.defaultValue : '';
        }
        continue;
      }

      // Check types
      if (varSpec.type === 'number') {
        const numVal = Number(value);
        if (isNaN(numVal)) {
          errors[varSpec.key] = `"${varSpec.label}" must be a valid number.`;
        } else {
          sanitized[varSpec.key] = numVal;
        }
      } else if (varSpec.type === 'boolean') {
        sanitized[varSpec.key] = typeof value === 'string' ? value.toLowerCase() === 'true' : Boolean(value);
      } else if (varSpec.type === 'enum') {
        const strVal = String(value);
        if (varSpec.choices && !varSpec.choices.includes(strVal)) {
          errors[varSpec.key] = `"${varSpec.label}" must be one of: ${varSpec.choices.join(', ')}.`;
        } else {
          sanitized[varSpec.key] = strVal;
        }
      } else {
        // String type check regex or length
        const strVal = String(value).trim();
        if (varSpec.regexPattern) {
          try {
            const rx = new RegExp(varSpec.regexPattern);
            if (!rx.test(strVal)) {
              errors[varSpec.key] = `"${varSpec.label}" operates on an invalid format pattern.`;
            } else {
              sanitized[varSpec.key] = strVal;
            }
          } catch {
            sanitized[varSpec.key] = strVal; // Ignore broken specification regex in DB
          }
        } else {
          sanitized[varSpec.key] = strVal;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Interpolates variables into system prompt / instructions scaffolds. Corrects double curly formats.
   */
  static compilePrompt(
    scaffold: string,
    variables: Record<string, HarnessVariableValue>
  ): string {
    if (!scaffold) return '';
    let compiled = scaffold;

    Object.entries(variables).forEach(([key, val]) => {
      // Replaces matches of {{key}} or {{ key }} safely
      const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      compiled = compiled.replace(pattern, String(val));
    });

    return compiled;
  }

  /**
   * Returns any {{variable}} placeholders that were not replaced by compilePrompt.
   * Useful for warning users that their scaffold has unresolved keys.
   */
  static detectUnresolvedVariables(compiled: string): string[] {
    const matches = [...compiled.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
    return [...new Set(matches.map(m => m[1] ?? '').filter(Boolean))];
  }

  /**
   * Redacts high-proprietary templates and blocks if locks are verified.
   */
  static redactPremiumContent(
    content: string,
    isPremium: boolean,
    hasUnlocked: boolean
  ): string {
    if (!content) return '';
    if (!isPremium || hasUnlocked) return content;

    // Mask actual operational details recursively to preserve structure but protect property
    return content.split('\n').map((line, _idx) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      // Retain JSON brackets and basic structure labels, redact prompts and operational rules
      if (trimmed.startsWith('{') || trimmed.startsWith('}') || trimmed.startsWith('[') || trimmed.startsWith(']')) {
        return line;
      }
      if (trimmed.includes('"') && trimmed.includes(':')) {
        const colonIndex = line.indexOf(':');
        const prefix = line.substring(0, colonIndex + 1);
        return `${prefix} "[REDACTED PREMIUM CONTENT - PURCHASE LICENSE TO UNLOCK]"`;
      }
      if (line.match(/^\s*\-\s+/)) {
        const indent = line.match(/^\s*/)?.[0] || '';
        return `${indent}- [REDACTED PREMIUM SPECIFICATION]`;
      }
      return '/* [REDACTED INTELLECTUAL PROPERTY - ACTIVE LICENSE REQUIRED] */';
    }).join('\n');
  }

  /**
   * EXPORTS IMPLEMENTATIONS
   */

  static toMarkdown(
    name: string,
    version: string,
    compiledPrompt: string,
    operatingRules?: string,
    workflows?: string
  ): string {
    return `# Agent Harness: ${name} (v${version})

> Generated securely via HarnessOS

## System Instructions & Core Prompt
\`\`\`text
${compiledPrompt}
\`\`\`

${operatingRules ? `## Operating & Safety Rules\n${operatingRules}\n` : ''}
${workflows ? `## Workflow Workplans\n${workflows}\n` : ''}
---
*Confidentiality Notice: Built for execution engines natively.*
`;
  }

  static toJSON(
    name: string,
    version: string,
    compiledPrompt: string,
    variables: Record<string, HarnessVariableValue>,
    operatingRules?: string
  ): string {
    return JSON.stringify(
      {
        harnessName: name,
        compilerVersion: 'HarnessOS-v1.0',
        metadata: {
          version,
          exportedAt: new Date().toISOString(),
        },
        payload: {
          systemPrompt: compiledPrompt,
          operatingRules: operatingRules || '',
          runtimeVariables: variables,
        },
      },
      null,
      2
    );
  }

  static toYAML(
    name: string,
    version: string,
    compiledPrompt: string,
    variables: Record<string, HarnessVariableValue>
  ): string {
    // Elegant standard stringification for config systems
    const cleanPrompt = compiledPrompt.replace(/\n/g, '\n    ');
    let yaml = `---
harness:
  name: "${name}"
  version: "${version}"
  compiler: "HarnessOS-Engine-1.0"
  system_instructions: |
    ${cleanPrompt}
  variables:
`;
    Object.entries(variables).forEach(([key, val]) => {
      yaml += `    ${key}: "${String(val).replace(/"/g, '\\"')}"\n`;
    });

    return yaml;
  }

  /**
   * Visual Line comparator for version diffing
   */
  static diffVersions(v1Prompt: string, v2Prompt: string): Array<{ type: 'added' | 'removed' | 'unchanged'; text: string }> {
    const l1 = v1Prompt.split('\n');
    const l2 = v2Prompt.split('\n');
    const result: Array<{ type: 'added' | 'removed' | 'unchanged'; text: string }> = [];

    // Basic heuristic LCS-like matching representation for SaaS comparisons
    const maxLines = Math.max(l1.length, l2.length);
    for (let i = 0; i < maxLines; i++) {
      const line1 = l1[i];
      const line2 = l2[i];

      if (line1 === line2) {
        if (line1 !== undefined) {
          result.push({ type: 'unchanged', text: line1 });
        }
      } else {
        if (line1 !== undefined) {
          result.push({ type: 'removed', text: line1 });
        }
        if (line2 !== undefined) {
          result.push({ type: 'added', text: line2 });
        }
      }
    }

    return result;
  }
}
