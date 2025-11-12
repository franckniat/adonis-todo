import { useState } from 'react'
import AppLayout from '@/components/layouts/app-layout'
import TodoForm from '@/components/todo/todo-form'
import TodoList from '@/components/todo/todo-list'
import TodoItem from '@/components/todo/todo-item'
import { Button } from '@/components/ui/button'
import { Head } from '@inertiajs/react'
import { KanbanSquareIcon, ListIcon } from 'lucide-react'
import type { Todo } from '@/types/todo'

type ViewMode = 'list' | 'kanban'

interface HomeProps {
  todos: {
    data: Todo[]
    meta: {
      total: number
      per_page: number
      current_page: number
      last_page: number
    }
  }
  filters: {
    search: string
    status: string
    sortBy: string
    sortOrder: string
  }
}

export default function Home({ todos }: HomeProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')


  // Vue Kanban groupée par statut
  const kanbanColumns = {
    pending: todos.data.filter((t) => t.status === 'pending'),
    completed: todos.data.filter((t) => t.status === 'completed'),
  }

  return (
    <AppLayout>
      <Head title="Gestionnaire de tâches" />
      <div className="space-y-6 py-4">
        <div className='text-center'>
          <h1 className="text-2xl font-bold">Gestionnaire de <span className='text-primary'>Tâches</span></h1>
          <p className="text-muted-foreground">Organisez et suivez vos tâches efficacement</p>
        </div>

        <TodoForm />
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div></div>
          {/* Toggle vue liste/kanban */}
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="size-4 mr-2" />
              Liste
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <KanbanSquareIcon className="size-4 mr-2" />
              Kanban
            </Button>
          </div>
        </div>

        {/* Vue liste */}
        {viewMode === 'list' && <TodoList todos={todos.data} />}

        {/* Vue Kanban */}
        {viewMode === 'kanban' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Colonne À faire */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <h2 className="font-semibold text-lg">À faire</h2>
                <span className="text-sm bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                  {kanbanColumns.pending.length}
                </span>
              </div>
              <div className="space-y-2">
                {kanbanColumns.pending.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                    Aucune tâche en cours
                  </div>
                ) : (
                  kanbanColumns.pending.map((todo) => <TodoItem key={todo.id} todo={todo} />)
                )}
              </div>
            </div>

            {/* Colonne Terminé */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <h2 className="font-semibold text-lg">Terminées</h2>
                <span className="text-sm bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  {kanbanColumns.completed.length}
                </span>
              </div>
              <div className="space-y-2">
                {kanbanColumns.completed.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                    Aucune tâche terminée
                  </div>
                ) : (
                  kanbanColumns.completed.map((todo) => <TodoItem key={todo.id} todo={todo} />)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
