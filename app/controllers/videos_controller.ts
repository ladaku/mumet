import type { HttpContext } from '@adonisjs/core/http'

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
  async index({ request, response }: HttpContext) {
    try {
      const results = await fetch('https://chudai-api.ouwi.fun/api/video')
      const resultData = (await results.json()) as ListVideo
      // eslint-disable-next-line @unicorn/no-instanceof-array
      if (resultData.data instanceof Array) {
        let sliceBkp = resultData.data.slice(0, 5)
        return response.ctx?.view.render('pages/home', { name: 'msbutnno', data: resultData.data })
      }
      return response.ctx?.view.render('pages/home', { name: 'msbutnno' })
    } catch (error) {
      return response.ctx?.view.render('pages/errors/server_error')
    }
  }

  async video({ params, request, response }: HttpContext) {
    const { slug } = params
    if (!slug) return response.ctx?.view.render('pages/errors/not_found')
    try {
      const result = await fetch(`https://chudai-api.ouwi.fun/api/video/detail/${slug}`)
      const responseJson = (await result.json()) as DetailVideo
      if (responseJson.code === 400) {
        return response.ctx?.view.render('pages/errors/not_found')
      }

      return response.ctx?.view.render('pages/video', { data: responseJson.data })
    } catch (error) {
      return response.ctx?.view.render('pages/errors/server_error')
    }
  }
}
