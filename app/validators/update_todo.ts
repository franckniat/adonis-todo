import vine from '@vinejs/vine'

export const updateTodoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    description: vine.string().trim().optional().nullable(),
    status: vine.enum(['pending', 'completed']).optional(),
    priority: vine.enum(['low', 'medium', 'high']).optional(),
    dueDate: vine
      .date({ formats: ['YYYY-MM-DD', 'ISO'] })
      .optional()
      .nullable(),
    order: vine.number().optional(),
    tags: vine.array(vine.string().trim().minLength(1).maxLength(50)).optional(),
  })
)
