// Legacy test reference — kept for historical context.
// Active tests are in src/lib/__tests__/harness-engine.test.ts (Vitest).
// Run: npm test
//
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HarnessEngine } from '../src/lib/harness-engine.js';
import { CATEGORIES, SAMPLE_TEMPLATES } from '../src/data.js';
import { UserRole } from '../src/types.js';

// Simple lightweight assertion engine
let testCount = 0;
let failureCount = 0;

function assert(condition: boolean, desc: string) {
  testCount++;
  if (condition) {
    console.log(`✅ PASS: ${desc}`);
  } else {
    failureCount++;
    console.error(`❌ FAIL: ${desc}`);
  }
}

function runTestSuite() {
  console.log('🏁 Starting HarnessOS Core Test Suite...\n');

  // ==========================================
  // Test 1: Variable Schema Validation
  // ==========================================
  console.log('--- Test Group 1: Schema Validation ---');
  const testSchema = {
    variables: [
      {
        key: 'system_name',
        label: 'System Name',
        type: 'string' as const,
        required: true,
        defaultValue: 'Agent1'
      },
      {
        key: 'max_tokens',
        label: 'Max Tokens',
        type: 'number' as const,
        required: false,
        defaultValue: 2048
      },
      {
        key: 'model_tier',
        label: 'Model Tier',
        type: 'enum' as const,
        required: true,
        choices: ['fast', 'pro']
      },
      {
        key: 'enabled',
        label: 'Enabled',
        type: 'boolean' as const,
        required: false,
        defaultValue: false
      }
    ]
  };

  const validVars = {
    system_name: 'ZenSupport',
    max_tokens: '1000',
    model_tier: 'fast',
    enabled: 'true'
  };

  const res1 = HarnessEngine.validateVariables(validVars, testSchema);
  assert(res1.isValid === true, 'Valid variables validate green');
  assert(res1.sanitized.max_tokens === 1000, 'Max tokens converted to type number');
  assert(res1.sanitized.enabled === true, 'Enabled converted to type boolean');

  const invalidVars = {
    system_name: '', // required, empty
    max_tokens: 'not_a_number',
    model_tier: 'enterprise-invalid'
  };

  const res2 = HarnessEngine.validateVariables(invalidVars, testSchema);
  assert(res2.isValid === false, 'Invalid inputs return false state');
  assert(res2.errors.system_name !== undefined, 'Throws error on required empty fields');
  assert(res2.errors.max_tokens !== undefined, 'Throws error on unparseable numbers');
  assert(res2.errors.model_tier !== undefined, 'Throws error on enum out-of-bounds keys');


  // ==========================================
  // Test 2: Double Curly Prompt Interpolation
  // ==========================================
  console.log('\n--- Test Group 2: Prompt Interpolation ---');
  const scaffold = 'Hello {{ username }}, your agent roles are {{ roles }}. Welcome to the grid.';
  const values = { username: 'Ada', roles: 'Engineering Executive' };
  const compiled = HarnessEngine.compilePrompt(scaffold, values);
  assert(
    compiled === 'Hello Ada, your agent roles are Engineering Executive. Welcome to the grid.',
    'Compiles double-curly variable syntax correctly'
  );


  // ==========================================
  // Test 3: Premium Locker Redaction
  // ==========================================
  console.log('\n--- Test Group 3: Premium Lock Redaction ---');
  const sensitiveJSON = `{
  "key_system_instructions": "This is extremely proprietary secret formula to avoid refunds.",
  "fallback": "Standard fallback actions goes here"
}`;

  const redactedUnlocked = HarnessEngine.redactPremiumContent(sensitiveJSON, true, true);
  assert(redactedUnlocked === sensitiveJSON, 'Licensed/unlocked premium assets pass raw prompt unchanged');

  const redactedLocked = HarnessEngine.redactPremiumContent(sensitiveJSON, true, false);
  assert(
    redactedLocked.includes('[REDACTED PREMIUM CONTENT - PURCHASE LICENSE TO UNLOCK]'),
    'Locked premium rules have keys fully scrubbed and redacted'
  );
  assert(
    !redactedLocked.includes('proprietary secret formula'),
    'Strict redaction eliminates raw proprietary strings'
  );


  // ==========================================
  // Test 4: Relational Cat/Template Schema Links
  // ==========================================
  console.log('\n--- Test Group 4: Category-Template Association Invariants ---');
  const hasInconsistentRelations = SAMPLE_TEMPLATES.some(t => {
    const matched = CATEGORIES.some(c => c.id === t.categoryId);
    return !matched;
  });
  assert(!hasInconsistentRelations, 'All templates link exclusively to valid Category relational IDs');


  // ==========================================
  // Test 5: Role Sandbox Permissions Checks
  // ==========================================
  console.log('\n--- Test Group 5: Role Guards Permission Invariants ---');
  
  function checkHasUpdateAccess(role: UserRole): boolean {
    const permittedRoles = [UserRole.WORKSPACE_OWNER, UserRole.WORKSPACE_ADMIN, UserRole.ADMIN, UserRole.SUPER_ADMIN];
    return permittedRoles.includes(role);
  }

  assert(checkHasUpdateAccess(UserRole.WORKSPACE_OWNER) === true, 'Workspace owners pass update gate checks');
  assert(checkHasUpdateAccess(UserRole.GUEST) === false, 'Guest is blocked from workspace writes');
  assert(checkHasUpdateAccess(UserRole.USER) === false, 'Standard user is blocked from workspace upgrades');

  // ==========================================
  // Summary outputs
  // ==========================================
  console.log('\n==========================================');
  console.log(`📊 TEST RUNNER SUMMARY: ${testCount - failureCount}/${testCount} PASSED`);
  if (failureCount > 0) {
    console.error(`💥 ERROR: ${failureCount} failures occurred in Core validation engine.`);
    process.exit(1);
  } else {
    console.log('👑 ALL TESTS GREEN. COMPACT HARNESS-ENGINE ARCHITECTURE LOCKED IN.');
  }
}

runTestSuite();
