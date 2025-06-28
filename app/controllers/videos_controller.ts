import Video from '#models/video'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { existsSync } from 'node:fs'
import path from 'node:path'
import env from '#start/env'
import fs from 'node:fs/promises'
// import { DateTime } from 'luxon'

type ListVideo = {
  message: string
  data?: any[]
  status: boolean
  code: number
}

type DetailVideo = {
  message: string
  data?: any
  status: boolean
  code: number
}

export default class VideosController {
  async chudaiIndex({ response, request }: HttpContext) {
    try {
      let page: number = 1
      let size: number = 10
      if (request.qs().page && request.qs().size) {
        page = request.qs().page
        size = request.qs().size
      }

      const results = await fetch(`${env.get('API_URL')}/v1/posts/?page=${page - 1}&size=${size}`)

      const resultData = (await results.json()) as ListVideo
      //  console.log('hoii', resultData, env.get('WITH_ADS'))
      // eslint-disable-next-line @unicorn/no-instanceof-array
      // if (resultData.data instanceof Array) {
      //   let sliceBkp = resultData.data
      //   return response.ctx?.view.render('pages/index', {
      //     posts: [],
      //   })
      // }
      let renderView: string = env.get('WITH_ADS') ? 'pages/index' : 'pages/indexNoAds'
      return response.ctx?.view.render(renderView, {
        posts: resultData.data,
      })
    } catch (error) {
      console.log(error, 'emror')

      return response.ctx?.view.render('pages/errors/server_error', { code: 500 })
    }
  }

  async index({ response }: HttpContext) {
    try {
      // const results = await fetch('https://chudai-api.ouwi.fun/api/video')
      // const resultData = (await results.json()) as ListVideo
      // eslint-disable-next-line @unicorn/no-instanceof-array
      // if (resultData.data instanceof Array) {
      //   //let sliceBkp = resultData.data.slice(0, 5)
      //   return response.ctx?.view.render('pages/index', { name: 'msbutnno', data: resultData.data })
      // }
      const videos = await Video.all()
      console.log(videos)

      // let now = DateTime.local()

      return response.ctx?.view.render('pages/video/index', {
        data: videos.map((item) => ({
          ...item.$original,
          createdAt: item.$original.createdAt.toFormat('yyyy-MM-dd HH:mm:ss'),
        })),
      })
    } catch (error) {
      return response.ctx?.view.render('pages/errors/server_error', { code: 500 })
    }
  }

  async indexPaging({ request, response }: HttpContext) {
    try {
      // const results = await fetch('https://chudai-api.ouwi.fun/api/video')
      // const resultData = (await results.json()) as ListVideo
      // eslint-disable-next-line @unicorn/no-instanceof-array
      // if (resultData.data instanceof Array) {
      //   //let sliceBkp = resultData.data.slice(0, 5)
      //   return response.ctx?.view.render('pages/index', { name: 'msbutnno', data: resultData.data })
      // }

      const page = request.input('page', 1)
      const posts = await db.from('videos').orderBy('id', 'desc').paginate(page, 10)
      console.log(posts, 'mikkk')
      // posts.map((item) => ({
      //   ...item.$original,
      //   createdAt: item.$original.createdAt.toFormat('yyyy-MM-dd HH:mm:ss'),
      // })),
      posts.baseUrl('/')
      return response.ctx?.view.render('pages/index', {
        posts,
      })
    } catch (error) {
      return response.ctx?.view.render('pages/errors/server_error', { code: 500 })
    }
  }

  async video({ params, response }: HttpContext) {
    const { slug } = params
    if (!slug) return response.ctx?.view.render('pages/errors/not_found')
    try {
      // let blue = await Video.findBy('code', slug)
      const result = await fetch(`${env.get('API_URL')}/v1/posts/${slug}`)
      let resp = (await result.json()) as DetailVideo

      let renderView: string = env.get('WITH_ADS') ? 'pages/video' : 'pages/videoNoAds'
      return response.ctx?.view.render(renderView, { data: resp?.data })
    } catch (error) {
      return response.ctx?.view.render('pages/errors/server_error', { code: 500 })
    }
  }

  async create({ request, response }: HttpContext) {
    // db.table('video').returning('id').insert({
    //   title: 'juiha',
    //   desc: 'engeh',
    // })

    try {
      const thumb = request.file('thumb')
      await thumb?.move(app.makePath('storage/thumb'), {
        name: `${cuid()}.${thumb.extname}`,
      })

      const video = request.file('video')
      await video?.move(app.makePath('storage/video'), {
        name: `${cuid()}.${video.extname}`,
      })

      await Video.create({
        title: request.body().title,
        desc: request.body().desc,
        code: cuid().slice(0, 8),
        thumb: thumb?.fileName,
        file_video: video?.fileName,
      })
      return response.redirect('/portal/video')
    } catch (error) {
      console.log(error)
      return response.ctx?.view.render('pages/errors/server_error', { code: 500 })
    }
  }

  async destroy({ response, params }: HttpContext) {
    try {
      let video = await Video.findOrFail(params?.id)
      let vidFile = `storage/video/${video.$original?.file_video}`
      let thumbFile = `storage/thumb/${video.$original?.thumb}`

      let exsf = existsSync(vidFile)
      if (exsf === true) await fs.unlink(vidFile)
      let existThumb = existsSync(thumbFile)
      if (existThumb === true) await fs.unlink(thumbFile)

      await video.delete()
      const resolvedPath = path.resolve('/storage/video/c7itg3rinxyi83t7w9lmclg.mp4')
      console.log(params, resolvedPath, vidFile, exsf, video, 'hahah')
      //await fs.unlink(huhu)
      return response.redirect().back()
    } catch (error) {
      console.log(error)
      return response.redirect().back()
    }
  }
}
