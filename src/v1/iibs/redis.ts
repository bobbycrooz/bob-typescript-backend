import { createClient } from 'redis'

const client = createClient({
  password: '5dE4NXLehZzNd7lO6L7D4Oh38weo4Jch',
  socket: {
    host: 'redis-15919.c17.us-east-1-4.ec2.cloud.redislabs.com',
    port: 15919
  }
})

client.on('error', (err) => console.log('Redis Client Error', err))

// @ts-ignore
await client.connect()
