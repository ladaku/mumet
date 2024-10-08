/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const VideosController = () => import('#controllers/videos_controller')

router.get('/', [VideosController, 'index'])
router.get('/v/:slug', [VideosController, 'video'])
