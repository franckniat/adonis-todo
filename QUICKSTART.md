# 🚀 Guide de démarrage rapide

## ⚡ Lancer l'application

```bash
# Installer les dépendances (si pas déjà fait)
bun install

# Lancer le serveur de développement
bun run dev
```

Ouvrez votre navigateur sur `http://localhost:3333` (ou le port configuré)

## 🎨 Tester l'interface

L'interface est **déjà fonctionnelle** avec des données mockées !

### Ce que vous pouvez faire :

1. ✅ **Créer des tâches** - Utilisez le formulaire en haut
2. ✅ **Ajouter description** - Cliquez sur l'icône 📄
3. ✅ **Choisir une date** - Cliquez sur l'icône 📅
4. ✅ **Ajouter des tags** - Cliquez sur l'icône 🏷️
5. ✅ **Changer la priorité** - Cliquez sur les badges (Faible/Moyenne/Haute)
6. ✅ **Rechercher** - Utilisez la barre de recherche
7. ✅ **Filtrer** - Cliquez sur "Filtrer & Trier"
8. ✅ **Voir les stats** - Cartes en haut de la liste
9. ✅ **Vue Kanban** - Toggle Liste/Kanban
10. ✅ **Exporter** - JSON ou CSV depuis le panneau de filtres
11. ✅ **Éditer** - Hover sur une tâche → ✏️
12. ✅ **Supprimer** - Hover sur une tâche → 🗑️
13. ✅ **Marquer terminé** - Cochez la checkbox
14. ✅ **Mode sombre** - Toggle en haut à droite

### 📱 Tester le responsive

- Redimensionnez la fenêtre
- Testez sur mobile (DevTools)
- Tout s'adapte automatiquement !

## 🔧 Connecter au backend (quand prêt)

### 1. Créer le controller AdonisJS

```bash
node ace make:controller Todo
```

### 2. Ajouter les routes dans `start/routes.ts`

```typescript
import router from '@adonisjs/core/services/router'

router.get('/', async ({ inertia }) => {
  // Pour le moment sans backend
  return inertia.render('home', { todos: [] })
})

// Routes API (à implémenter)
router.post('/todos', 'TodosController.store')
router.patch('/todos/:id', 'TodosController.update')
router.delete('/todos/:id', 'TodosController.destroy')
```

### 3. Créer la migration

```bash
node ace make:migration create_todos_table
```

```typescript
// database/migrations/xxx_create_todos_table.ts
export default class extends BaseSchema {
  protected tableName = 'todos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.enum('status', ['pending', 'completed']).defaultTo('pending')
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium')
      table.timestamp('due_date').nullable()
      table.json('tags').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### 4. Créer le model

```bash
node ace make:model Todo
```

```typescript
// app/models/todo.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: 'pending' | 'completed'

  @column()
  declare priority: 'low' | 'medium' | 'high'

  @column.dateTime()
  declare dueDate: DateTime | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare tags: string[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

### 5. Implémenter le controller

```typescript
// app/controllers/todos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'

export default class TodosController {
  async index({ inertia }: HttpContext) {
    const todos = await Todo.query().orderBy('created_at', 'desc')
    return inertia.render('home', { todos })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'priority', 'dueDate', 'tags'])
    const todo = await Todo.create(data)
    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    const data = request.only(['title', 'description', 'status', 'priority', 'dueDate'])
    await todo.merge(data).save()
    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()
    return response.redirect().back()
  }
}
```

### 6. Mettre à jour la route principale

```typescript
// start/routes.ts
router.get('/', 'TodosController.index')
```

### 7. Supprimer les données mockées

Dans `inertia/pages/home.tsx`, supprimez l'import :

```typescript
// Supprimez cette ligne :
import { mockTodos } from '@/lib/mock-data'

// Et utilisez uniquement :
const displayTodos = todos || []
```

## 🎯 C'est tout !

Votre application est maintenant **entièrement fonctionnelle** ! 🎊

### Checklist finale

- ✅ Interface complète et responsive
- ✅ Toutes les fonctionnalités du ROADMAP
- ✅ Design moderne avec shadcn/ui
- ✅ TypeScript strict
- ✅ Prêt pour le backend AdonisJS

### Support

- 📖 Documentation : `inertia/README.md`
- 📝 Résumé : `IMPLEMENTATION.md`
- 🗺️ Roadmap : `ROADMAP.md`

**Bon développement ! 🚀**
