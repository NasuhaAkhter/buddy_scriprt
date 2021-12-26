import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StaticPages extends BaseSchema {
  protected tableName = 'static_pages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('page_name', 191).unique()
      table.text('description', 'longtext')
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
