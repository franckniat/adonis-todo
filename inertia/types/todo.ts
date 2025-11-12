export type TodoPriority = 'low' | 'medium' | 'high'
export type TodoStatus = 'pending' | 'completed'

export interface Todo {
  id: number
  title: string
  description?: string | null
  status: TodoStatus
  priority: TodoPriority
  dueDate?: string | null
  tags?: string[]
  isOverdue?: boolean
  order?: number
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  priority?: TodoPriority
  dueDate?: string
  tags?: string[]
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  status?: TodoStatus
  order?: number
}

export type TodoFilter = 'all' | 'pending' | 'completed'
export type TodoSortBy = 'createdAt' | 'dueDate' | 'priority'
