import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table.enum('status', ['pending', 'completed']).defaultTo('pending')
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium')
      table.date('due_date').nullable()
      table.boolean('is_overdue').defaultTo(false)
      table.integer('order').defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
