"use strict";

// In-memory database — demo only.
const tasks = [
  { id: "task-001", workspaceId: "ws-001", title: "Set up CI pipeline",  status: "open",   assignee: "user-001" },
  { id: "task-002", workspaceId: "ws-001", title: "Write API docs",       status: "closed", assignee: "user-002" },
  { id: "task-003", workspaceId: "ws-002", title: "Security review",      status: "open",   assignee: "user-003" },
];

const db = {
  // Safe: parameterized query simulation — always use this form.
  query(sql, params = []) {
    let result = [...tasks];
    if (sql.includes("workspace_id = ?")) {
      result = result.filter((t) => t.workspaceId === params[0]);
    }
    if (sql.includes("status = ?")) {
      const status = params[params.length - 1];
      result = result.filter((t) => t.status === status);
    }
    return Promise.resolve(result);
  },

  // Safe: always scope task reads to the caller's workspace.
  getTaskForWorkspace(taskId, workspaceId) {
    const task = tasks.find((t) => t.id === taskId && t.workspaceId === workspaceId);
    return Promise.resolve(task || null);
  },

  // Unsafe: no workspace scoping — left here for demo comparison only.
  getTask(taskId) {
    return Promise.resolve(tasks.find((t) => t.id === taskId) || null);
  },
};

module.exports = { db };
