import redis, { getOptions } from './redis'

export const fetchCount = async (key: string) => {
  let data = await redis.hget('counts', key) as any
  if (data)
    data = parseInt(data)

  if (!data)
    data = 0

  return data
}

export const increment = async (key: string) => {
  const res = await redis.hincrby('counts', key, 1)

  return res
}