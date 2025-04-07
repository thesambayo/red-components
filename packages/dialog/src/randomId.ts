const prefix = `${Math.random().toString(36).substring(2, 8)}`;
let id = 0;
export const nextId = () => `dialog-${prefix}-${++id}`;
