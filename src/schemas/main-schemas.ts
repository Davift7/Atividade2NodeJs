// ==================== USER ====================

export const loginJsonSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  }
};

export const userJsonSchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    photo: { type: 'string', format: 'uri' }
  }
};

export const userUpdateJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    photo: { type: 'string', format: 'uri' }
  }
};

// ==================== POST ====================

export const postJsonSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 }
  }
};

export const postUpdateJsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 }
  }
};

// ==================== COMMENT ====================

export const createCommentJsonSchema = {
  type: 'object',
  required: ['content', 'postId'],
  properties: {
    content: { type: 'string', minLength: 1 },
    postId: { type: 'string', minLength: 1 }
  }
};

export const updateCommentJsonSchema = {
  type: 'object',
  required: ['content'],
  properties: {
    content: { type: 'string', minLength: 1 }
  }
};

// ==================== LIKE ====================

export const likeJsonSchema = {
  type: 'object',
  properties: {
    postId: { type: 'string' },
    commentId: { type: 'string' }
  },
  oneOf: [
    { required: ['postId'] },
    { required: ['commentId'] }
  ],
  
};
