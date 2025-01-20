/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
const VideosController = () => import('#controllers/videos_controller')

router.get('/portal/video', [VideosController, 'index'])
router.get('/v/:slug', [VideosController, 'video'])

//router.on('/').render('pages/home')
router.get('/', [VideosController, 'indexPaging'])
router.on('/dashboard').render('pages/home')
router.on('/table').render('pages/table')
router.on('/billing').render('pages/billing')
router.on('/virtual-reality').render('pages/virtual-reality')
router.on('/rtl').render('pages/rtl')
router.on('/notifications').render('pages/notifications')
router.on('/profile').render('pages/profile')
router.on('/signin').render('pages/signin')
router.on('/signup').render('pages/signup')

router.on('/portal/video/create').render('pages/video/create')
router.post('/act/video/create', [VideosController, 'create'])
router.delete('/act/video/delete/:id', [VideosController, 'destroy']).as('act.video.delete')

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/thumb/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('storage/thumb', normalizedPath)
  return response.download(absolutePath)
})

router.get('/video/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('storage/video', normalizedPath)
  return response.download(absolutePath)
})
