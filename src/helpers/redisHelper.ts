import { Redis } from '@upstash/redis'
import config from '../config'

const client = new Redis({
  url: config.redis.url,
  token: config.redis.token,

})

const set = async (key:any,value:any)=>{
    await client.set(key, JSON.stringify(value),{ex:30})
}

const get = async (key:any)=>{
    const value = await client.get(key)
    return value
}

export const redisHelper ={
    set,
    get,
    client
}

