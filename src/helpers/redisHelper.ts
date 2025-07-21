import Redis from 'ioredis'
import config from '../config'
const client = new Redis({ host: 'localhost', port: 6379 });


const set = async (key:any,value:any)=>{
    await client.set(key, JSON.stringify(value),'EX',1000000000000)
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

