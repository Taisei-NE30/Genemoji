export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    text: { type: 'string' },
  },
  required: ['name']
} as const;
