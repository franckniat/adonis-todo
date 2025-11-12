import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import TodoTag from '#models/todo_tag'

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

  @column.date()
  declare dueDate: DateTime | null

  @column()
  declare isOverdue: boolean

  @column()
  declare order: number

  // Relations
  @hasMany(() => TodoTag)
  declare tags: HasMany<typeof TodoTag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async checkOverdue() {
    if (this.dueDate && this.status === 'pending') {
      this.isOverdue = this.dueDate < DateTime.now()
      await this.save()
    }
  }

  serialize() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate?.toISO(),
      isOverdue: this.isOverdue,
      order: this.order,
      tags: this.tags,
      createdAt: this.createdAt.toISO(),
      updatedAt: this.updatedAt.toISO(),
    }
  }
}
