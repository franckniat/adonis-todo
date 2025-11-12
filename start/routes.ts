/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const TodosController = () => import('#controllers/todos_controller')

router.group(() => {
  // Page d'accueil avec liste des tâches
  router.get('/', [TodosController, 'index']).as('home')

  // CRUD des tâches
  router.post('/todos', [TodosController, 'store']).as('todos.store')
  router.put('/todos/:id', [TodosController, 'update']).as('todos.update')
  router.delete('/todos/:id', [TodosController, 'destroy']).as('todos.destroy')

  // Actions spéciales
  router.patch('/todos/:id/toggle', [TodosController, 'toggleStatus']).as('todos.toggle')

  // Export
  router.get('/todos/export/json', [TodosController, 'exportJson']).as('todos.export.json')
  router.get('/todos/export/csv', [TodosController, 'exportCsv']).as('todos.export.csv')
})
