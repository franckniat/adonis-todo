import { useState } from 'react'
import { router } from '@inertiajs/react'
import { CalendarIcon, EditIcon, Trash2Icon, TagIcon, Grip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { InputGroup, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import type { Todo, TodoPriority, UpdateTodoInput } from '@/types/todo'
import { toast } from 'sonner'
import { Checkbox } from '../ui/checkbox'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TodoItemProps {
  todo: Todo
  isDragging?: boolean
}

const priorityColors: Record<TodoPriority, string> = {
  low: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  high: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
}

const priorityLabels: Record<TodoPriority, string> = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Haute',
}

export default function TodoItem({ todo, isDragging = false }: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)
  const [editedDescription, setEditedDescription] = useState(todo.description || '')
  const [editedPriority, setEditedPriority] = useState<TodoPriority>(todo.priority)
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.7 : 1,
  }

  const handleToggleStatus = () => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed'

    router.patch(`/todos/${todo.id}`, { status: newStatus } as any, {
      onSuccess: () => {
        toast.success(
          newStatus === 'completed'
            ? 'Tâche marquée comme terminée'
            : 'Tâche marquée comme en cours'
        )
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour')
      },
    })
  }

  const handleUpdate = () => {
    if (!editedTitle.trim()) {
      toast.error('Le titre est requis')
      return
    }

    const updateData: UpdateTodoInput = {
      title: editedTitle.trim(),
      description: editedDescription.trim() || undefined,
      priority: editedPriority,
      dueDate: editedDueDate?.toISOString(),
    }

    router.patch(`/todos/${todo.id}`, updateData as any, {
      onSuccess: () => {
        toast.success('Tâche mise à jour avec succès')
        setIsEditOpen(false)
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour')
      },
    })
  }

  const handleDelete = () => {
    router.delete(`/todos/${todo.id}`, {
      onSuccess: () => {
        toast.success('Tâche supprimée avec succès')
        setIsDeleteOpen(false)
      },
      onError: () => {
        toast.error('Erreur lors de la suppression')
      },
    })
  }

  const isOverdue =
    todo.dueDate && todo.status !== 'completed' && new Date(todo.dueDate) < new Date()

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-start gap-3 p-4 rounded-lg border bg-card transition-all hover:shadow-md ${
          isDragging ? 'opacity-50' : ''
        } ${todo.status === 'completed' ? 'opacity-60' : ''}`}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          title="Glisser pour réorganiser"
        >
          <Grip className="size-5 text-muted-foreground" />
        </button>

        {/* Checkbox */}
        <Checkbox
          checked={todo.status === 'completed'}
          onChange={handleToggleStatus}
          className="mt-1 size-4 rounded cursor-pointer"
        />

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium ${
              todo.status === 'completed' ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{todo.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priorité */}
            <Badge className={priorityColors[todo.priority]}>{priorityLabels[todo.priority]}</Badge>

            {/* Date d'échéance */}
            {todo.dueDate && (
              <Badge
                variant="outline"
                className={isOverdue ? 'border-red-500 text-red-700 dark:text-red-400' : ''}
              >
                <CalendarIcon className="size-3 mr-1" />
                {new Date(todo.dueDate).toLocaleDateString('fr-FR')}
                {isOverdue && ' (En retard)'}
              </Badge>
            )}

            {/* Tags */}
            {todo && todo.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <TagIcon className="size-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsEditOpen(true)}
            title="Modifier"
          >
            <EditIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsDeleteOpen(true)}
            title="Supprimer"
          >
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Sheet d'édition */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Modifier la tâche</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 px-4">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre</Label>
              <InputGroup>
                <InputGroupInput
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                />
              </InputGroup>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <InputGroup>
                <InputGroupTextarea
                  id="edit-description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Description (optionnelle)"
                  rows={5}
                  className="min-h-[120px]"
                />
              </InputGroup>
            </div>

            {/* Priorité */}
            <div className="space-y-2">
              <Label>Priorité</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TodoPriority[]).map((p) => (
                  <Badge
                    key={p}
                    className={`cursor-pointer transition-all ${
                      editedPriority === p
                        ? priorityColors[p]
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    onClick={() => setEditedPriority(p)}
                  >
                    {priorityLabels[p]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Date d'échéance */}
            <div className="space-y-3">
              <Label>Date d'échéance</Label>
              <Calendar
                mode="single"
                selected={editedDueDate}
                onSelect={setEditedDueDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="w-full bg-card rounded-md"
              />
              {editedDueDate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditedDueDate(undefined)}
                  className="w-full"
                >
                  Supprimer la date
                </Button>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>Enregistrer</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La tâche "{todo.title}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
