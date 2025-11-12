import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Todo from '#models/todo'

export default class TodoTag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare todoId: number

  @column()
  declare name: string

  @column()
  declare color: string

  @belongsTo(() => Todo)
  declare todo: BelongsTo<typeof Todo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
