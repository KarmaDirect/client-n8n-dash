#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNTcwMzkzfQ.WASEs8nkVKJaq-wERh8g3t4ri5HJoRvrOw_swZP9kl4';
const N8N_BASE_URL = 'https://primary-production-bdba.up.railway.app/api/v1';

const api = axios.create({
  baseURL: N8N_BASE_URL,
  headers: { 'X-N8N-API-KEY': N8N_API_KEY },
});

class N8NServer {
  constructor() {
    this.server = new Server(
      { name: 'n8n-mcp-complete', version: '3.0.0' },
      { capabilities: { tools: {} } }
    );
    this.setupToolHandlers();
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // WORKFLOWS
        { name: 'workflow_list', description: '📋 Liste workflows' },
        { name: 'workflow_read', description: '🔍 Lit workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'workflow_create', description: '✨ Crée workflow', inputSchema: { type: 'object', properties: { name: { type: 'string' }, nodes: { type: 'array' }, connections: { type: 'object' } }, required: ['name', 'nodes'] } },
        { name: 'workflow_update', description: '✏️ Update workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' }, data: { type: 'object' } }, required: ['id', 'data'] } },
        { name: 'workflow_delete', description: '🗑️ Supprime workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'workflow_activate', description: '✅ Active workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'workflow_deactivate', description: '⏸️ Désactive workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        
        // EXECUTIONS
        { name: 'execution_list', description: '📊 Liste exécutions', inputSchema: { type: 'object', properties: { workflowId: { type: 'string' }, limit: { type: 'number' } } } },
        { name: 'execution_read', description: '🔍 Lit exécution', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'execution_delete', description: '🗑️ Supprime exécution', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'execution_retry', description: '🔄 Retry exécution', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        
        // CREDENTIALS
        { name: 'credential_list', description: '🔑 Liste credentials' },
        { name: 'credential_create', description: '✨ Crée credential', inputSchema: { type: 'object', properties: { name: { type: 'string' }, type: { type: 'string' }, data: { type: 'object' } }, required: ['name', 'type', 'data'] } },
        { name: 'credential_delete', description: '🗑️ Supprime credential', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        
        // TAGS
        { name: 'tag_list', description: '🏷️ Liste tags' },
        { name: 'tag_read', description: '🔍 Lit tag', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'tag_create', description: '✨ Crée tag', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
        { name: 'tag_update', description: '✏️ Update tag', inputSchema: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } }, required: ['id', 'name'] } },
        { name: 'tag_delete', description: '🗑️ Supprime tag', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        
        // WORKFLOW TAGS
        { name: 'workflowTags_list', description: '🏷️ Liste workflow tags', inputSchema: { type: 'object', properties: { workflowId: { type: 'string' } }, required: ['workflowId'] } },
        { name: 'workflowTags_update', description: '✏️ Update workflow tags', inputSchema: { type: 'object', properties: { workflowId: { type: 'string' }, tagIds: { type: 'array' } }, required: ['workflowId', 'tagIds'] } },
        
        // VARIABLES
        { name: 'variable_list', description: '📦 Liste variables' },
        { name: 'variable_create', description: '✨ Crée variable', inputSchema: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'string' } }, required: ['key', 'value'] } },
        { name: 'variable_update', description: '✏️ Update variable', inputSchema: { type: 'object', properties: { id: { type: 'string' }, value: { type: 'string' } }, required: ['id', 'value'] } },
        { name: 'variable_delete', description: '🗑️ Supprime variable', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        
        // USERS
        { name: 'user_list', description: '👥 Liste users' },
        { name: 'user_read', description: '🔍 Lit user', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'user_create', description: '✨ Crée user', inputSchema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string' } }, required: ['email', 'password'] } },
        { name: 'user_delete', description: '🗑️ Supprime user', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'user_changeRole', description: '👤 Change role', inputSchema: { type: 'object', properties: { id: { type: 'string' }, role: { type: 'string' } }, required: ['id', 'role'] } },
        
        // PROJECTS
        { name: 'project_list', description: '📁 Liste projects' },
        { name: 'project_create', description: '✨ Crée project', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
        { name: 'project_update', description: '✏️ Update project', inputSchema: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } }, required: ['id', 'name'] } },
        { name: 'project_delete', description: '🗑️ Supprime project', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        
        // SOURCE CONTROL
        { name: 'sourceControl_pull', description: '⬇️ Pull from git' },
        
        // SECURITY AUDIT
        { name: 'securityAudit_generate', description: '🔒 Génère audit' },
        
        // UTILITIES
        { name: 'search_workflows', description: '🔎 Recherche workflows', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
        { name: 'duplicate_workflow', description: '📋 Duplique workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' }, newName: { type: 'string' } }, required: ['id', 'newName'] } },
        { name: 'export_workflow', description: '💾 Export workflow', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
        { name: 'import_workflow', description: '📥 Import workflow', inputSchema: { type: 'object', properties: { data: { type: 'object' } }, required: ['data'] } },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        const result = await this.handleTool(name, args);
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`
          }]
        };
      }
    });
  }

  async handleTool(name, args) {
    // WORKFLOWS
    if (name === 'workflow_list') {
      const res = await api.get('/workflows');
      return `✅ ${res.data.data.length} workflows:\n\n${JSON.stringify(res.data.data.map(w => ({ id: w.id, name: w.name, active: w.active })), null, 2)}`;
    }
    if (name === 'workflow_read') {
      const res = await api.get(`/workflows/${args.id}`);
      return `✅ Workflow:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'workflow_create') {
      const res = await api.post('/workflows', { name: args.name, nodes: args.nodes, connections: args.connections || {}, active: false });
      return `✅ Workflow créé: ${res.data.data.id} - ${res.data.data.name}`;
    }
    if (name === 'workflow_update') {
      const current = await api.get(`/workflows/${args.id}`);
      const res = await api.patch(`/workflows/${args.id}`, { ...current.data.data, ...args.data });
      return `✅ Workflow mis à jour: ${args.id}`;
    }
    if (name === 'workflow_delete') {
      await api.delete(`/workflows/${args.id}`);
      return `✅ Workflow ${args.id} supprimé`;
    }
    if (name === 'workflow_activate') {
      const current = await api.get(`/workflows/${args.id}`);
      await api.patch(`/workflows/${args.id}`, { ...current.data.data, active: true });
      return `✅ Workflow ${args.id} activé`;
    }
    if (name === 'workflow_deactivate') {
      const current = await api.get(`/workflows/${args.id}`);
      await api.patch(`/workflows/${args.id}`, { ...current.data.data, active: false });
      return `✅ Workflow ${args.id} désactivé`;
    }

    // EXECUTIONS
    if (name === 'execution_list') {
      const params = {};
      if (args.workflowId) params.workflowId = args.workflowId;
      if (args.limit) params.limit = args.limit;
      const res = await api.get('/executions', { params });
      return `✅ ${res.data.data.length} exécutions:\n\n${JSON.stringify(res.data.data.map(e => ({ id: e.id, status: e.status, startedAt: e.startedAt })), null, 2)}`;
    }
    if (name === 'execution_read') {
      const res = await api.get(`/executions/${args.id}`);
      return `✅ Exécution:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'execution_delete') {
      await api.delete(`/executions/${args.id}`);
      return `✅ Exécution ${args.id} supprimée`;
    }
    if (name === 'execution_retry') {
      const res = await api.post(`/executions/${args.id}/retry`);
      return `✅ Exécution ${args.id} relancée: ${res.data.data.id}`;
    }

    // CREDENTIALS
    if (name === 'credential_list') {
      const res = await api.get('/credentials');
      return `✅ ${res.data.data.length} credentials:\n\n${JSON.stringify(res.data.data.map(c => ({ id: c.id, name: c.name, type: c.type })), null, 2)}`;
    }
    if (name === 'credential_create') {
      const res = await api.post('/credentials', { name: args.name, type: args.type, data: args.data });
      return `✅ Credential créé: ${res.data.data.id} - ${res.data.data.name}`;
    }
    if (name === 'credential_delete') {
      await api.delete(`/credentials/${args.id}`);
      return `✅ Credential ${args.id} supprimé`;
    }

    // TAGS
    if (name === 'tag_list') {
      const res = await api.get('/tags');
      return `✅ ${res.data.data.length} tags:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'tag_read') {
      const res = await api.get(`/tags/${args.id}`);
      return `✅ Tag:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'tag_create') {
      const res = await api.post('/tags', { name: args.name });
      return `✅ Tag créé: ${res.data.data.id} - ${res.data.data.name}`;
    }
    if (name === 'tag_update') {
      const res = await api.patch(`/tags/${args.id}`, { name: args.name });
      return `✅ Tag mis à jour: ${args.id}`;
    }
    if (name === 'tag_delete') {
      await api.delete(`/tags/${args.id}`);
      return `✅ Tag ${args.id} supprimé`;
    }

    // WORKFLOW TAGS
    if (name === 'workflowTags_list') {
      const res = await api.get(`/workflows/${args.workflowId}/tags`);
      return `✅ Tags:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'workflowTags_update') {
      await api.put(`/workflows/${args.workflowId}/tags`, { tagIds: args.tagIds });
      return `✅ Tags workflow ${args.workflowId} mis à jour`;
    }

    // VARIABLES
    if (name === 'variable_list') {
      const res = await api.get('/variables');
      return `✅ ${res.data.data.length} variables:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'variable_create') {
      const res = await api.post('/variables', { key: args.key, value: args.value });
      return `✅ Variable créée: ${res.data.data.id} - ${res.data.data.key}`;
    }
    if (name === 'variable_update') {
      const res = await api.patch(`/variables/${args.id}`, { value: args.value });
      return `✅ Variable ${args.id} mise à jour`;
    }
    if (name === 'variable_delete') {
      await api.delete(`/variables/${args.id}`);
      return `✅ Variable ${args.id} supprimée`;
    }

    // USERS
    if (name === 'user_list') {
      const res = await api.get('/users');
      return `✅ ${res.data.data.length} users:\n\n${JSON.stringify(res.data.data.map(u => ({ id: u.id, email: u.email, role: u.role })), null, 2)}`;
    }
    if (name === 'user_read') {
      const res = await api.get(`/users/${args.id}`);
      return `✅ User:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'user_create') {
      const res = await api.post('/users', { email: args.email, password: args.password, role: args.role || 'user' });
      return `✅ User créé: ${res.data.data.id} - ${res.data.data.email}`;
    }
    if (name === 'user_delete') {
      await api.delete(`/users/${args.id}`);
      return `✅ User ${args.id} supprimé`;
    }
    if (name === 'user_changeRole') {
      await api.patch(`/users/${args.id}/role`, { role: args.role });
      return `✅ Role user ${args.id} changé en ${args.role}`;
    }

    // PROJECTS
    if (name === 'project_list') {
      const res = await api.get('/projects');
      return `✅ ${res.data.data.length} projects:\n\n${JSON.stringify(res.data.data, null, 2)}`;
    }
    if (name === 'project_create') {
      const res = await api.post('/projects', { name: args.name });
      return `✅ Project créé: ${res.data.data.id} - ${res.data.data.name}`;
    }
    if (name === 'project_update') {
      await api.patch(`/projects/${args.id}`, { name: args.name });
      return `✅ Project ${args.id} mis à jour`;
    }
    if (name === 'project_delete') {
      await api.delete(`/projects/${args.id}`);
      return `✅ Project ${args.id} supprimé`;
    }

    // SOURCE CONTROL
    if (name === 'sourceControl_pull') {
      const res = await api.post('/source-control/pull');
      return `✅ Git pull effectué:\n\n${JSON.stringify(res.data, null, 2)}`;
    }

    // SECURITY AUDIT
    if (name === 'securityAudit_generate') {
      const res = await api.post('/audit');
      return `✅ Audit de sécurité généré:\n\n${JSON.stringify(res.data, null, 2)}`;
    }

    // UTILITIES
    if (name === 'search_workflows') {
      const res = await api.get('/workflows');
      const filtered = res.data.data.filter(w => w.name.toLowerCase().includes(args.query.toLowerCase()));
      return `✅ ${filtered.length} résultat(s):\n\n${JSON.stringify(filtered.map(w => ({ id: w.id, name: w.name })), null, 2)}`;
    }
    if (name === 'duplicate_workflow') {
      const original = await api.get(`/workflows/${args.id}`);
      const duplicate = { ...original.data.data, name: args.newName, active: false };
      delete duplicate.id;
      delete duplicate.createdAt;
      delete duplicate.updatedAt;
      const res = await api.post('/workflows', duplicate);
      return `✅ Workflow dupliqué: ${res.data.data.id} - ${res.data.data.name}`;
    }
    if (name === 'export_workflow') {
      const res = await api.get(`/workflows/${args.id}`);
      return `✅ Export:\n\n\`\`\`json\n${JSON.stringify(res.data.data, null, 2)}\n\`\`\``;
    }
    if (name === 'import_workflow') {
      const res = await api.post('/workflows', args.data);
      return `✅ Workflow importé: ${res.data.data.id} - ${res.data.data.name}`;
    }

    throw new Error(`Unknown tool: ${name}`);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('n8n MCP Complete v3.0 running');
  }
}

const server = new N8NServer();
server.run().catch(console.error);

