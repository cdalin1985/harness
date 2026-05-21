/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, UserRole, Workspace, HarnessInstance } from '../types';

/**
 * DATABASE MODELS (Strict snake_case matching production datastore blueprints)
 */

export interface DbUser {
  uid: string;
  email: string;
  display_name: string;
  photo_url: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

export interface DbWorkspace {
  id: string;
  owner_id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface DbHarnessInstance {
  id: string;
  workspace_id: string;
  template_id: string;
  version_id: string;
  name: string;
  customized_variables: Record<string, string | number | boolean>;
  customized_prompt: string;
  notes: string;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

/**
 * CONVERSION MAPPERS (Translates Database <-> Client DTOs)
 */

export const UserMapper = {
  toClient(dbUser: DbUser): User {
    return {
      id: dbUser.uid,
      email: dbUser.email,
      name: dbUser.display_name || 'Developer',
      avatar_url: dbUser.photo_url || '',
      role: (dbUser.role as UserRole) || UserRole.USER,
      createdAt: dbUser.created_at || new Date().toISOString(),
      updatedAt: dbUser.updated_at || dbUser.created_at || new Date().toISOString(),
    };
  },

  toDatabase(user: User): DbUser {
    return {
      uid: user.id,
      email: user.email,
      display_name: user.name,
      photo_url: user.avatar_url,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
};

export const WorkspaceMapper = {
  toClient(dbWorkspace: DbWorkspace): Workspace {
    return {
      id: dbWorkspace.id,
      ownerId: dbWorkspace.owner_id,
      name: dbWorkspace.name,
      plan: dbWorkspace.plan,
      createdAt: dbWorkspace.created_at || new Date().toISOString(),
      updatedAt: dbWorkspace.updated_at || new Date().toISOString(),
    };
  },

  toDatabase(workspace: Workspace): DbWorkspace {
    return {
      id: workspace.id,
      owner_id: workspace.ownerId,
      name: workspace.name,
      plan: workspace.plan,
      created_at: workspace.createdAt,
      updated_at: workspace.updatedAt,
    };
  }
};

export const HarnessInstanceMapper = {
  toClient(dbInstance: DbHarnessInstance): HarnessInstance {
    return {
      id: dbInstance.id,
      workspaceId: dbInstance.workspace_id,
      templateId: dbInstance.template_id,
      versionId: dbInstance.version_id,
      name: dbInstance.name,
      customizedVariables: dbInstance.customized_variables || {},
      customizedPrompt: dbInstance.customized_prompt || '',
      notes: dbInstance.notes || '',
      status: dbInstance.status || 'draft',
      createdAt: dbInstance.created_at || new Date().toISOString(),
      updatedAt: dbInstance.updated_at || new Date().toISOString(),
    };
  },

  toDatabase(instance: HarnessInstance): DbHarnessInstance {
    return {
      id: instance.id,
      workspace_id: instance.workspaceId,
      template_id: instance.templateId,
      version_id: instance.versionId,
      name: instance.name,
      customized_variables: instance.customizedVariables,
      customized_prompt: instance.customizedPrompt,
      notes: instance.notes,
      status: instance.status,
      created_at: instance.createdAt,
      updated_at: instance.updatedAt,
    };
  }
};
