import { MilvusClient } from '@zilliz/milvus2-sdk-node'

(async () => {
  const client = new MilvusClient({ address: 'localhost:19530', ssl: false })
  const searchParams = {
    anns_field: 'embeddings',
    topk: '3',
    metric_type: 'L2',
    params: JSON.stringify({ ef: 64 }),
  }
  await client.search({
    collection_name: 'document',
    vector: Array.from(Array(1536), () => Math.random()),
    expr: 'project=="Uniswap V3"',
    params: searchParams,
    limit: 3,
  })
})()
