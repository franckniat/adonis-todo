import vine from '@vinejs/vine'

export const createTodoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().optional(),
    priority: vine.enum(['low', 'medium', 'high']).optional(),
    dueDate: vine.date({ formats: ['YYYY-MM-DD', 'ISO'] }).optional(),
    tags: vine.array(vine.string().trim().minLength(1).maxLength(50)).optional(),
  })
)
