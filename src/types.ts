/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  WORKSPACE_OWNER = 'workspace_owner',
  WORKSPACE_ADMIN = 'workspace_admin',
  WORKSPACE_MEMBER = 'workspace_member',
  CONTENT_EDITOR = 'content_editor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface HarnessCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export interface HarnessTemplate {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  targetUser: string;
  businessOutcome: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  priceType: 'free' | 'one_time' | 'subscription';
  price: number;
  isPremium: boolean;
  status: 'draft' | 'published' | 'archived';
  currentVersionId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface HarnessVersion {
  id: string;
  templateId: string;
  version: string;
  changelog: string;
  systemPrompt: string;
  operatingRules: string;
  workflowSteps: string;
  toolRules: string;
  memoryRules: string;
  inputSchema: string;
  outputSchema: string;
  variablesSchema: string;
  exportFormats: string[];
  qualityRubric: string;
  testSuiteId: string;
  createdAt: string;
  createdBy: string;
}

export interface HarnessInstance {
  id: string;
  workspaceId: string;
  templateId: string;
  versionId: string;
  name: string;
  customizedVariables: Record<string, string | number | boolean>;
  customizedPrompt: string;
  notes: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  template?: HarnessTemplate; // For frontend convenience
}

export interface HarnessEvaluation {
  id: string;
  instanceId: string;
  testSuiteId: string;
  score: number;
  summary: string;
  resultsJson: string;
  createdAt: string;
  createdBy: string;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  workspaceId: string;
  eventName: string;
  propertiesJson: string;
  timestamp: string;
}
