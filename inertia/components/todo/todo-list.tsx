import { useState, useMemo } from 'react'
import { SearchIcon, FilterIcon, ArrowUpDownIcon, DownloadIcon } from 'lucide-react'
import TodoItem from './todo-item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Empty } from '@/components/ui/empty'
import type { Todo, TodoFilter, TodoSortBy } from '@/types/todo'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [sortBy, setSortBy] = useState<TodoSortBy>('createdAt')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id)
      const newIndex = todos.findIndex((todo) => todo.id === over?.id)

      const newTodosOrder = arrayMove(todos, oldIndex, newIndex)
      console.log('Nouvel ordre des tâches :', newTodosOrder)

      // Ici, vous pouvez envoyer `newTodosOrder` au backend pour sauvegarder l'ordre
      // Par exemple :
      // await router.post('/todos/reorder', { todos: newTodosOrder })

      toast.success('Ordre des tâches mis à jour')
    }
  }

  // Filtrage et tri
  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos]

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          todo.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filtre par statut
    if (filter !== 'all') {
      result = result.filter((todo) => todo.status === filter)
    }

    // Tri
    result.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        default:
          return 0
      }
    })

    return result
  }, [todos, searchQuery, filter, sortBy])

  // Statistiques
  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.status === 'completed').length
    const pending = todos.filter((t) => t.status === 'pending').length
    const overdue = todos.filter(
      (t) => t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length

    return { total, completed, pending, overdue }
  }, [todos])

  // Export en JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredAndSortedTodos, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `todos-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Export JSON réussi')
  }

  // Export en CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Titre',
      'Description',
      'Statut',
      'Priorité',
      "Date d'échéance",
      'Tags',
      'Créé le',
    ]
    const rows = filteredAndSortedTodos.map((todo) => [
      todo.id,
      todo.title,
      todo.description || '',
      todo.status,
      todo.priority,
      todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('fr-FR') : '',
      todo.tags?.join('; ') || '',
      new Date(todo.createdAt).toLocaleDateString('fr-FR'),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `todos-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Export CSV réussi')
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une tâche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="default">
                <FilterIcon className="size-4 mr-2" />
                Filtrer & Trier
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filtres et tri</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 px-4">
                {/* Filtre par statut */}
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'all' as TodoFilter, label: 'Toutes', count: stats.total },
                      { value: 'pending' as TodoFilter, label: 'En cours', count: stats.pending },
                      {
                        value: 'completed' as TodoFilter,
                        label: 'Terminées',
                        count: stats.completed,
                      },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={filter === option.value ? 'default' : 'outline'}
                        className="justify-between"
                        onClick={() => setFilter(option.value)}
                      >
                        <span>{option.label}</span>
                        <Badge variant="secondary">{option.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tri */}
                <div className="space-y-2">
                  <Label>Trier par</Label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'createdAt' as TodoSortBy, label: 'Date de création' },
                      { value: 'dueDate' as TodoSortBy, label: "Date d'échéance" },
                      { value: 'priority' as TodoSortBy, label: 'Priorité' },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setSortBy(option.value)}
                      >
                        <ArrowUpDownIcon className="size-4 mr-2" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Export */}
                <div className="space-y-2">
                  <Label>Exporter</Label>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={handleExportJSON}>
                      <DownloadIcon className="size-4 mr-2" />
                      Exporter en JSON
                    </Button>
                    <Button variant="outline" onClick={handleExportCSV}>
                      <DownloadIcon className="size-4 mr-2" />
                      Exporter en CSV
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">En cours</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Terminées</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">En retard</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-2">
        {filteredAndSortedTodos.length === 0 ? (
          <Empty
            icon={SearchIcon}
            title={searchQuery ? 'Aucune tâche trouvée' : 'Aucune tâche'}
            description={
              searchQuery
                ? 'Essayez de modifier votre recherche'
                : 'Commencez par créer une nouvelle tâche'
            }
          />
        ) : (
          filteredAndSortedTodos.map((todo) => (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredAndSortedTodos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <TodoItem key={todo.id} todo={todo} />
              </SortableContext>
            </DndContext>
          ))
        )}
      </div>
    </div>
  )
}
