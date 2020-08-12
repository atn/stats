import { Request, Response, NextFunction } from 'express'

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== process.env.SECRET as string) return res.sendStatus(401)

  next()
}