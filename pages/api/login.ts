import { NextApiRequest, NextApiResponse } from 'next'

import { User } from '@/lib/useUser'
import { sessionOptions } from 'lib/session'
import { withIronSessionApiRoute } from 'iron-session/next'

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { code } = await req.body as { code: string }

  try {
    if (code !== '12345') throw new Error ('Invalid code')
    const user = { isLoggedIn: true } as User
    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)