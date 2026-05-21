/**
 * HarnessEngine unit tests (Vitest)
 * Ported from scripts/test-engine.ts + extended with edge cases.
 */
import { describe, it, expect } from 'vitest';
import { HarnessEngine, HarnessEngineSchema } from '../harness-engine';
import { CATEGORIES, SAMPLE_TEMPLATES } from '../../data';
import { UserRole } from '../../types';

// ---------------------------------------------------------------------------
// Shared test schema
// ---------------------------------------------------------------------------
const testSchema: HarnessEngineSchema = {
  variables: [
    { key: 'system_name', label: 'System Name', type: 'string', required: true, defaultValue: 'Agent1' },
    { key: 'max_tokens',  label: 'Max Tokens',  type: 'number', required: false, defaultValue: 2048 },
    { key: 'model_tier',  label: 'Model Tier',  type: 'enum',   required: true, choices: ['fast', 'pro'] },
    { key: 'enabled',     label: 'Enabled',     type: 'boolean', required: false, defaultValue: false },
  ],
};

// ---------------------------------------------------------------------------
// Group 1: Schema Validation
// ---------------------------------------------------------------------------
describe('Schema Validation', () => {
  it('validates correct variables successfully', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: 'ZenSupport', max_tokens: '1000', model_tier: 'fast', enabled: 'true' },
      testSchema
    );
    expect(result.isValid).toBe(true);
  });

  it('coerces max_tokens string to number', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: 'ZenSupport', max_tokens: '1000', model_tier: 'fast', enabled: 'true' },
      testSchema
    );
    expect(result.sanitized.max_tokens).toBe(1000);
  });

  it('coerces enabled string to boolean', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: 'ZenSupport', max_tokens: '1000', model_tier: 'fast', enabled: 'true' },
      testSchema
    );
    expect(result.sanitized.enabled).toBe(true);
  });

  it('returns isValid false for invalid inputs', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: '', max_tokens: 'not_a_number', model_tier: 'enterprise-invalid' },
      testSchema
    );
    expect(result.isValid).toBe(false);
  });

  it('reports error for empty required field', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: '', max_tokens: 'not_a_number', model_tier: 'enterprise-invalid' },
      testSchema
    );
    expect(result.errors.system_name).toBeDefined();
  });

  it('reports error for non-parseable number', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: 'ZenSupport', max_tokens: 'not_a_number', model_tier: 'fast' },
      testSchema
    );
    expect(result.errors.max_tokens).toBeDefined();
  });

  it('reports error for invalid enum value', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: 'ZenSupport', max_tokens: '1000', model_tier: 'enterprise-invalid' },
      testSchema
    );
    expect(result.errors.model_tier).toBeDefined();
  });

  // Edge case: malformed JSON schema string
  it('returns isValid false when schema JSON is malformed', () => {
    const result = HarnessEngine.validateVariables(
      { system_name: 'ZenSupport' },
      'NOT_VALID_JSON{'
    );
    expect(result.isValid).toBe(false);
    expect(result.errors._schema).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Group 2: Prompt Interpolation
// ---------------------------------------------------------------------------
describe('Prompt Interpolation', () => {
  it('replaces double-curly variables correctly', () => {
    const scaffold = 'Hello {{ username }}, your agent roles are {{ roles }}. Welcome to the grid.';
    const compiled = HarnessEngine.compilePrompt(scaffold, { username: 'Ada', roles: 'Engineering Executive' });
    expect(compiled).toBe('Hello Ada, your agent roles are Engineering Executive. Welcome to the grid.');
  });

  // Edge case: no matching variables
  it('returns scaffold unchanged when no variables match', () => {
    const scaffold = 'Hello {{ unknown_var }}';
    const compiled = HarnessEngine.compilePrompt(scaffold, { username: 'Ada' });
    expect(compiled).toBe('Hello {{ unknown_var }}');
  });
});

// ---------------------------------------------------------------------------
// Group 3: Premium Content Redaction
// ---------------------------------------------------------------------------
const sensitiveJSON = `{
  "key_system_instructions": "This is extremely proprietary secret formula to avoid refunds.",
  "fallback": "Standard fallback actions goes here"
}`;

describe('Premium Content Redaction', () => {
  it('passes content through when unlocked', () => {
    const result = HarnessEngine.redactPremiumContent(sensitiveJSON, true, true);
    expect(result).toBe(sensitiveJSON);
  });

  it('redacts content when locked', () => {
    const result = HarnessEngine.redactPremiumContent(sensitiveJSON, true, false);
    expect(result).toContain('[REDACTED PREMIUM CONTENT - PURCHASE LICENSE TO UNLOCK]');
  });

  it('does not expose proprietary strings when locked', () => {
    const result = HarnessEngine.redactPremiumContent(sensitiveJSON, true, false);
    expect(result).not.toContain('proprietary secret formula');
  });
});

// ---------------------------------------------------------------------------
// Group 4: Category-Template Association Invariants
// ---------------------------------------------------------------------------
describe('Category-Template Associations', () => {
  it('all templates reference valid category IDs', () => {
    const hasInconsistentRelations = SAMPLE_TEMPLATES.some(t =>
      !CATEGORIES.some(c => c.id === t.categoryId)
    );
    expect(hasInconsistentRelations).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Group 5: Role Permission Guards
// ---------------------------------------------------------------------------
describe('Role Permission Guards', () => {
  function checkHasUpdateAccess(role: UserRole): boolean {
    const permittedRoles = [UserRole.WORKSPACE_OWNER, UserRole.WORKSPACE_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN];
    return permittedRoles.includes(role);
  }

  it('grants update access to workspace owners', () => {
    expect(checkHasUpdateAccess(UserRole.WORKSPACE_OWNER)).toBe(true);
  });

  it('blocks update access for guests', () => {
    expect(checkHasUpdateAccess(UserRole.GUEST)).toBe(false);
  });

  it('blocks update access for standard users', () => {
    expect(checkHasUpdateAccess(UserRole.USER)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Group 6: Export Utilities (edge cases)
// ---------------------------------------------------------------------------
describe('YAML Export', () => {
  it('escapes double quotes in variable values', () => {
    const yaml = HarnessEngine.toYAML(
      'Test Harness',
      '1.0.0',
      'Hello world',
      { company: 'Acme "Corp"' }
    );
    // Should escape the inner double quotes
    expect(yaml).toContain('\\"Corp\\"');
  });
});
