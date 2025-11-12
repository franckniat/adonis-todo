import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import TodoTag from '#models/todo_tag'
import { createTodoValidator } from '#validators/create_todo'
import { updateTodoValidator } from '#validators/update_todo'
import { DateTime } from 'luxon'

export default class TodosController {
  /**
   * Afficher la page d'accueil avec toutes les tâches
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const search = request.input('search', '')
    const status = request.input('status', 'all')
    const sortBy = request.input('sortBy', 'createdAt')
    const sortOrder = request.input('sortOrder', 'desc')

    let query = Todo.query().preload('tags')

    // Recherche
    if (search) {
      query = query.where((builder) => {
        builder.where('title', 'LIKE', `%${search}%`).orWhere('description', 'LIKE', `%${search}%`)
      })
    }

    // Filtrage par statut
    if (status !== 'all') {
      query = query.where('status', status)
    }

    // Tri
    query = query.orderBy(sortBy, sortOrder)

    const todos = await query.paginate(page, limit)

    return inertia.render('home', {
      todos: todos.serialize(),
      filters: { search, status, sortBy, sortOrder },
    })
  }

  /**
   * Créer une nouvelle tâche
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createTodoValidator)

    const todo = await Todo.create({
      title: payload.title,
      description: payload.description,
      priority: payload.priority || 'medium',
      dueDate: payload.dueDate ? DateTime.fromJSDate(payload.dueDate) : undefined,
    })

    // Créer les tags si fournis
    if (payload.tags && payload.tags.length > 0) {
      const tags = payload.tags.map((tag) => ({
        todoId: todo.id,
        name: tag,
        color: 'gray',
      }))
      await TodoTag.createMany(tags)
    }

    session.flash('notification', {
      type: 'success',
      message: 'Tâche créée avec succès !',
    })

    return response.redirect().back()
  }

  /**
   * Mettre à jour une tâche
   */
  async update({ params, request, response, session }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    const payload = await request.validateUsing(updateTodoValidator)

    // Mise à jour des champs de base
    if (payload.title !== undefined) todo.title = payload.title
    if (payload.description !== undefined) todo.description = payload.description
    if (payload.status !== undefined) todo.status = payload.status
    if (payload.priority !== undefined) todo.priority = payload.priority
    if (payload.dueDate !== undefined)
      todo.dueDate = payload.dueDate ? DateTime.fromJSDate(payload.dueDate) : null
    if (payload.order !== undefined) todo.order = payload.order

    await todo.save()

    // Vérifier si en retard
    await todo.checkOverdue()

    // Mise à jour des tags
    if (payload.tags !== undefined) {
      // Supprimer les anciens tags
      await TodoTag.query().where('todo_id', todo.id).delete()

      // Créer les nouveaux tags
      if (payload.tags.length > 0) {
        const tags = payload.tags.map((tag) => ({
          todoId: todo.id,
          name: tag,
          color: 'gray',
        }))
        await TodoTag.createMany(tags)
      }
    }

    session.flash('notification', {
      type: 'success',
      message: 'Tâche mise à jour avec succès !',
    })

    return response.redirect().back()
  }

  /**
   * Supprimer une tâche
   */
  async destroy({ params, response, session }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()

    session.flash('notification', {
      type: 'success',
      message: 'Tâche supprimée avec succès !',
    })

    return response.redirect().back()
  }

  /**
   * Basculer le statut d'une tâche
   */
  async toggleStatus({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    todo.status = todo.status === 'pending' ? 'completed' : 'pending'
    await todo.save()

    return response.redirect().back()
  }

  /**
   * Exporter les tâches en JSON
   */
  async exportJson({ response }: HttpContext) {
    const todos = await Todo.query().preload('tags')

    return response.json({
      exported_at: new Date().toISOString(),
      total: todos.length,
      todos: todos.map((todo) => todo.serialize()),
    })
  }

  /**
   * Exporter les tâches en CSV
   */
  async exportCsv({ response }: HttpContext) {
    const todos = await Todo.query().preload('tags')

    const headers = [
      'ID',
      'Titre',
      'Description',
      'Statut',
      'Priorité',
      'Date limite',
      'Tags',
      'Créé le',
    ]
    const rows = todos.map((todo) => [
      todo.id,
      `"${todo.title}"`,
      `"${todo.description || ''}"`,
      todo.status,
      todo.priority,
      todo.dueDate?.toFormat('yyyy-MM-dd') || '',
      `"${todo.tags.map((t) => t.name).join(', ')}"`,
      todo.createdAt.toFormat('yyyy-MM-dd HH:mm:ss'),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')

    response.header('Content-Type', 'text/csv')
    response.header('Content-Disposition', 'attachment; filename=todos.csv')
    return response.send(csv)
  }
}
