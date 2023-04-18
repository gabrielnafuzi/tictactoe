import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export function withMethods(methods: Array<Method>, handler: NextApiHandler) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as Method)) {
      return res.status(405).end()
    }

    return handler(req, res)
  }
}
