/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UrlsController = () => import('#controllers/urls_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// v1 routes
router
  .group(() => {
    router.post('auth/signup', [AuthController, 'signup'])
    router.post('auth/login', [AuthController, 'login'])

    router.resource('urls', UrlsController).apiOnly()
  })
  .prefix('api/v1')

router.get('/r/:id', [UrlsController, 'redirect'])
