import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'crypto'
import User from '../models/user.js'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const body = request.body()

    const user = await User.findBy({ email: body.email, password: hashPassword(body.password) })
    if (!user) {
      response.status(400)
      return { status: 400, message: 'Invalid credentials' }
    }

    return {
      status: 200,
      message: 'Ok',
    }
  }

  async signup({ request, response }: HttpContext) {
    const body = request.body()

    const emailExists = await User.findBy({ email: body.email })
    if (emailExists) {
      response.status(400)
      return { status: 400, message: 'Email exists' }
    }

    const user = new User()
    user.email = body.email
    user.password = hashPassword(body.password)

    await user.save()

    return {
      status: 200,
      message: 'Ok',
    }
  }
}

/**
 * Hashes password along with salting
 * @param value Password to hash
 * @returns Hashed password
 */
export const hashPassword = (value: string) => {
  const saltedPassword =
    (process.env.PASSWORD_START_SALT ?? '') + value + (process.env.PASSWORD_END_SALT ?? '')
  const hashedPassword = crypto.createHash('sha512').update(saltedPassword).digest('hex')

  return hashedPassword
}
