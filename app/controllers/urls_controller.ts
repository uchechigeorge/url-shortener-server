import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Url from '#models/url'

export default class UrlsController {
  async index({ request }: HttpContext) {
    const { page, perPage } = request.qs()

    const query = db.query().from('urls')

    const result = await query.paginate(page || 1, perPage || 10)

    const { data, meta } = result.toJSON()

    data.forEach((e) => {
      e.live_url = process.env.ROOT_DOMAIN + `/r/${e.shortened_url}`
    })
    return {
      status: 200,
      data,
      meta,
    }
  }

  async show({ request, response }: HttpContext) {
    const id = request.param('id')
    if (!id) {
      response.status(400)
      return { status: 400, message: 'Invalid id' }
    }

    const query = db.query().from('urls').where('id', id)

    const result = await query.paginate(1, 1)

    if (!result.hasTotal) {
      response.status(400)
      return { status: 400, message: 'Invalid url' }
    }

    const { data } = result.toJSON()
    data.forEach((e) => {
      e.live_url = process.env.ROOT_DOMAIN + `/r/${e.shortened_url}`
    })

    return { status: 200, data: data[0] }
  }

  async redirect({ request, response }: HttpContext) {
    const id = request.param('id')
    if (!id) {
      response.status(400)
      return { status: 400, message: 'Invalid id' }
    }

    const url = await Url.findBy({ shortenedUrl: id })

    if (!url) {
      response.status(400)
      return { status: 400, message: 'Invalid url' }
    }

    response.redirect(url.websiteUrl)
  }

  async store({ request, response }: HttpContext) {
    const body = request.body()

    const shortened = await generateUrl()

    const url = new Url()
    url.description = body.description
    url.name = body.name
    url.websiteUrl = body.websiteUrl
    url.shortenedUrl = shortened

    await url.save()

    response.status(201)
    return {
      status: 201,
      message: 'Created',
      data: url,
    }
  }

  async update({ request, response }: HttpContext) {
    const body = request.body()

    const id = request.param('id')
    if (!id) {
      response.status(400)
      return { status: 400, message: 'Invalid id' }
    }

    const url = await Url.find(id)
    if (!url) {
      response.status(400)
      return { status: 400, message: 'Invalid url' }
    }

    url.description = body.description
    url.name = body.name
    url.websiteUrl = body.websiteUrl

    await url.save()

    response.status(201)
    return {
      status: 201,
      message: 'Created',
      data: url,
    }
  }

  async destroy({ request, response }: HttpContext) {
    const id = request.param('id')
    if (!id) {
      response.status(400)
      return { status: 400, message: 'Invalid id' }
    }

    const url = await Url.find(id)
    if (!url) {
      response.status(400)
      return { status: 400, message: 'Invalid url' }
    }

    await url.delete()
  }
}

const generateUrl = async (): Promise<string> => {
  let token = generateRandomString(6)
  const url = await Url.findBy({ shortenedUrl: token })

  if (url) {
    return await generateUrl()
  }

  return token
}

/**
 * Generates a random string
 * @param length Lenth of string to generate
 * @param options Options for string generation
 * @returns A random string
 */
const generateRandomString = (
  length: number = 10,
  options?: {
    type?: 'alpha-numeric' | 'alpha' | 'numeric'
    includeSymbols?: boolean
    caseSensitive?: boolean
  }
) => {
  let type = options?.type
  if (!options?.type) {
    type = 'alpha-numeric'
  }

  const upperCaseLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM'
  const lowerCaseLetters = 'qwertyuiopasdfghjklzxcvbnm'
  const numbers = '0123456789'

  let characters = ''

  switch (type) {
    case 'alpha':
      characters = upperCaseLetters
      if (options?.caseSensitive) {
        characters += lowerCaseLetters
      }
      break
    case 'alpha-numeric':
      characters = upperCaseLetters + numbers
      if (options?.caseSensitive) {
        characters += lowerCaseLetters
      }
      break
    case 'numeric':
      characters = numbers
  }

  if (options?.includeSymbols) characters += '.,/@#%*&-+=?!'

  let randomString = ''
  for (let i = 0; i < length; i++) {
    randomString += characters[getRandom(characters.length)]
  }

  return randomString
}

const getRandom = (max: number) => {
  return Math.floor(Math.random() * max)
}
