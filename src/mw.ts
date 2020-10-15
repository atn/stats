import { Request, Response, NextFunction } from 'express'

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== process.env.SECRET) return res.sendStatus(401)

  next()
}