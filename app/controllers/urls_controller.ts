import type { HttpContext } from '@adonisjs/core/http'
import Url from '#models/url'

export default class UrlsController {
  async index(ctx: HttpContext) {
    const result = await Url.all()

    return {
      status: 200,
      data: result,
    }
  }

  async show() {}

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
      data: null,
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
