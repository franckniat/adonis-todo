import { useState } from 'react'
import { PlusIcon, CalendarIcon, TagIcon, FileTextIcon } from 'lucide-react'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { TodoPriority } from '@/types/todo'
import { toast } from 'sonner'
import { useForm } from '@inertiajs/react'

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

export default function TodoForm() {
  const [showDescription, setShowDescription] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [currentTag, setCurrentTag] = useState('')

  const { data, setData, post, processing, reset, errors } = useForm({
    title: '',
    description: '',
    priority: 'medium' as TodoPriority,
    dueDate: undefined as Date | undefined,
    tags: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data.title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    post('/todos', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Tâche créée avec succès !')
        reset()
        setShowDescription(false)
        setShowDatePicker(false)
        setShowTagInput(false)
        setCurrentTag('')
      },
      onError: (errors) => {
        toast.error('Erreur lors de la création de la tâche')
        console.error(errors)
      },
    })
  }

  const addTag = () => {
    const tag = currentTag.trim()
    if (tag && !data.tags.includes(tag)) {
      setData('tags', [...data.tags, tag])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setData(
      'tags',
      data.tags.filter((tag) => tag !== tagToRemove)
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup>
          <InputGroupInput
            placeholder="Ajouter une nouvelle tâche..."
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            disabled={processing}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              onClick={() => setShowDescription(!showDescription)}
              title="Ajouter une description"
            >
              <FileTextIcon className="size-4" />
            </InputGroupButton>

            <Sheet open={showDatePicker} onOpenChange={setShowDatePicker}>
              <SheetTrigger asChild>
                <InputGroupButton type="button" size="icon-xs" title="Ajouter une date d'échéance">
                  <CalendarIcon className="size-4" />
                </InputGroupButton>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Date d'échéance</SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <Calendar
                    mode="single"
                    selected={data.dueDate}
                    onSelect={(date) => {
                      setData('dueDate', date)
                      setShowDatePicker(false)
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="w-full bg-card rounded-md"
                  />
                </div>
              </SheetContent>
            </Sheet>

            <InputGroupButton
              type="button"
              size="icon-xs"
              onClick={() => setShowTagInput(!showTagInput)}
              title="Ajouter des tags"
            >
              <TagIcon className="size-4" />
            </InputGroupButton>

            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-xs"
              title="Ajouter"
              disabled={processing || !data.title.trim()}
            >
              <PlusIcon className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}

        {/* Sélection de priorité */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Priorité :</Label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as TodoPriority[]).map((p) => (
              <Badge
                key={p}
                className={`cursor-pointer transition-all ${
                  data.priority === p
                    ? priorityColors[p]
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setData('priority', p)}
              >
                {priorityLabels[p]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description (conditionnelle) */}
        {showDescription && (
          <InputGroup>
            <InputGroupTextarea
              placeholder="Ajouter une description..."
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows={3}
              disabled={processing}
            />
          </InputGroup>
        )}

        {/* Tags (conditionnel) */}
        {showTagInput && (
          <div className="space-y-2">
            <InputGroup>
              <InputGroupInput
                placeholder="Ajouter un tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                disabled={processing}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton type="button" size="xs" onClick={addTag}>
                  Ajouter
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Affichage de la date sélectionnée */}
        {data.dueDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="size-4" />
            <span>
              Échéance :{' '}
              {data.dueDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setData('dueDate', undefined)}
            >
              Supprimer
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
