# 📝 Todo App - Documentation Frontend

## 🏗️ Architecture

Cette application de gestion de tâches (Todo) est construite avec :

- **React** + **TypeScript** pour l'interface utilisateur
- **Inertia.js** pour la communication avec le backend AdonisJS
- **Tailwind CSS** + **shadcn/ui** pour le design
- **Sonner** pour les notifications toast

## 📁 Structure des fichiers

```
inertia/
├── types/
│   └── todo.ts              # Types TypeScript pour les todos
├── components/
│   ├── todo/
│   │   ├── todo-form.tsx    # Formulaire de création de tâche
│   │   ├── todo-list.tsx    # Liste avec filtres et recherche
│   │   └── todo-item.tsx    # Item individuel avec actions
│   └── ui/                  # Composants shadcn/ui
└── pages/
    └── home.tsx             # Page principale
```

## 🎨 Composants principaux

### 1. TodoForm

Formulaire de création de tâche avec :

- Champ titre (requis)
- Description optionnelle (toggle)
- Sélecteur de priorité (low, medium, high)
- Date picker pour l'échéance
- Gestion des tags
- Input-group avec boutons d'action

**Utilisation :**

```tsx
import TodoForm from '@/components/todo/todo-form'
;<TodoForm />
```

### 2. TodoList

Liste de tâches avec :

- Barre de recherche (titre, description, tags)
- Filtres par statut (all, pending, completed)
- Tri (date création, échéance, priorité)
- Statistiques (total, en cours, terminées, en retard)
- Export JSON et CSV

**Utilisation :**

```tsx
import TodoList from '@/components/todo/todo-list'
;<TodoList todos={todos} />
```

### 3. TodoItem

Item de tâche avec :

- Checkbox pour marquer comme terminée
- Affichage priorité, date, tags
- Boutons édition/suppression (hover)
- Sheet pour édition complète
- AlertDialog pour confirmation de suppression
- Drag handle pour réorganisation

**Utilisation :**

```tsx
import TodoItem from '@/components/todo/todo-item'
;<TodoItem todo={todo} />
```

## 📊 Types TypeScript

```typescript
// Priorité de la tâche
type TodoPriority = 'low' | 'medium' | 'high'

// Statut de la tâche
type TodoStatus = 'pending' | 'completed'

// Structure d'une tâche
interface Todo {
  id: string
  title: string
  description?: string
  status: TodoStatus
  priority: TodoPriority
  dueDate?: Date | string
  tags?: string[]
  createdAt: Date | string
  updatedAt: Date | string
}

// Données pour créer une tâche
interface CreateTodoInput {
  title: string
  description?: string
  priority?: TodoPriority
  dueDate?: Date | string
  tags?: string[]
}

// Données pour mettre à jour une tâche
interface UpdateTodoInput extends Partial<CreateTodoInput> {
  status?: TodoStatus
}
```

## 🔄 Intégration Backend

Les composants utilisent `router` d'Inertia.js pour communiquer avec le backend :

```typescript
import { router } from '@inertiajs/react'

// Créer une tâche
router.post('/todos', todoData, {
  onSuccess: () => toast.success('Tâche créée'),
  onError: () => toast.error('Erreur'),
})

// Mettre à jour une tâche
router.patch(`/todos/${id}`, updateData, {
  onSuccess: () => toast.success('Tâche mise à jour'),
  onError: () => toast.error('Erreur'),
})

// Supprimer une tâche
router.delete(`/todos/${id}`, {
  onSuccess: () => toast.success('Tâche supprimée'),
  onError: () => toast.error('Erreur'),
})
```

## 🎯 Fonctionnalités implémentées

### ✅ Gestion des tâches

- ✅ Créer une tâche (titre, description, priorité, date, tags)
- ✅ Modifier une tâche (Sheet avec formulaire complet)
- ✅ Supprimer une tâche (AlertDialog de confirmation)
- ✅ Marquer comme terminée/en cours (checkbox)
- ✅ Date d'échéance avec date picker
- ✅ Système de priorité (3 niveaux)

### ✅ Organisation et filtrage

- ✅ Recherche par mot-clé (titre, description, tags)
- ✅ Filtrage par statut (all, pending, completed)
- ✅ Tri (création, échéance, priorité)
- ✅ Tags/catégories

### ✅ Interface utilisateur

- ✅ Page d'accueil avec liste des tâches
- ✅ Formulaire d'ajout intuitif avec input-group
- ✅ Interface d'édition (Sheet) et suppression (AlertDialog)
- ✅ Design responsive (mobile + desktop)
- ✅ Feedback utilisateur (Sonner toasts)

### ✅ Fonctionnalités avancées

- ✅ Tri automatique selon critères
- ✅ Vue Kanban (à faire / terminé)
- ✅ Indicateur de tâches en retard
- ✅ Mode clair/sombre
- ✅ Export JSON et CSV
- 🔄 Drag & drop (UI prête, nécessite intégration)
- ⏳ Notifications de rappel (à implémenter)

## 🎨 Personnalisation

### Couleurs de priorité

```typescript
const priorityColors = {
  low: 'bg-green-500/10 text-green-700 dark:text-green-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  high: 'bg-red-500/10 text-red-700 dark:text-red-400',
}
```

### Labels de priorité

```typescript
const priorityLabels = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Haute',
}
```

## 📱 Responsive Design

Tous les composants sont conçus pour être responsive :

- Mobile-first avec Tailwind CSS
- Breakpoints adaptés (sm, md, lg)
- Sheet latéral sur mobile, modal sur desktop
- Grid adaptatif pour les statistiques et le Kanban

## 🚀 Prochaines étapes (Backend)

Pour rendre l'application fonctionnelle, le backend AdonisJS doit implémenter :

1. **Routes API** :
   - `POST /todos` - Créer une tâche
   - `GET /todos` - Lister les tâches
   - `PATCH /todos/:id` - Mettre à jour
   - `DELETE /todos/:id` - Supprimer

2. **Model Todo** :
   - Champs correspondant à l'interface TypeScript
   - Validation des données

3. **Controller TodosController** :
   - Logique CRUD
   - Gestion des erreurs
   - Retour des données via Inertia

4. **Migrations** :
   - Table `todos` avec tous les champs
   - Indexes pour les requêtes

## 💡 Tips d'utilisation

1. **Données mockées** : La page `home.tsx` contient des données d'exemple pour tester l'UI
2. **Toast notifications** : Importez `toast` depuis `sonner` pour feedback utilisateur
3. **Validation** : Ajoutez des validations côté client avant soumission
4. **États de chargement** : Ajoutez des loaders pendant les requêtes Inertia
5. **Drag & Drop** : Intégrez une lib comme `@dnd-kit/core` pour activer le drag & drop

## 🎓 Exemple complet

```tsx
import { Head } from '@inertiajs/react'
import AppLayout from '@/components/layouts/app-layout'
import TodoForm from '@/components/todo/todo-form'
import TodoList from '@/components/todo/todo-list'
import type { Todo } from '@/types/todo'

interface HomeProps {
  todos: Todo[]
}

export default function Home({ todos }: HomeProps) {
  return (
    <AppLayout>
      <Head title="Mes tâches" />
      <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
        <h1 className="text-3xl font-bold">Mes tâches</h1>
        <TodoForm />
        <TodoList todos={todos} />
      </div>
    </AppLayout>
  )
}
```

---

**Fait avec ❤️ pour votre projet AdonisJS + React**
