import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Url extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  declare userId: number

  @column({})
  declare name: string

  @column({})
  declare websiteUrl: string

  @column({})
  declare description: string

  @column({})
  declare shortenedUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
