import express from 'express'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'
import mongoose from 'mongoose'
import projectController from 'src/controller/project.controller'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, createEmbedding, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import { Success } from './utils'
const address = process.env.MILVUS_ADDRESS
const username = process.env.MILVUS_USERNAME
const password = process.env.MILVUS_PASSWORD
const ssl = false

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

let milvusClient: MilvusClient

router.get('/health', (req, res) => res.send('OK'))

router.post('/similarity-search', async (req, res) => {
  try {
    const { prompt, project } = req.body as RequestProps
    if (!project) {
      res.send(Success({}))
      return
    }
    // 计算embeddings
    const embeddingResponse = await createEmbedding({
      message: prompt,
    })
    // 搜索相似内容
    const searchParams = {
      anns_field: 'embeddings',
      topk: '3',
      metric_type: 'L2',
      params: JSON.stringify({ ef: 64 }),
    }
    const searchResult = await milvusClient.search({
      collection_name: 'document',
      vector: embeddingResponse.data.data[0].embedding,
      expr: `project=="${project}"`,
      params: searchParams,
      limit: 3,
    })
    res.send({
      status: 'Success',
      data: searchResult.results,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.send()
  }
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.get('/projects', projectController.getList)

app.use('', router)
app.use('/api', router)

const start = async () => {
  try {
    // mongodb
    await mongoose.connect(process.env.MONGODB_URI)
    // milvus
    milvusClient = new MilvusClient({ address, ssl, username, password })
    app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
  }
  catch (error) {
    if (milvusClient)
      await milvusClient.closeConnection()

    console.error(error)
    process.exit(1)
  }
}

start()
