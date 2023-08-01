const http = require('http')

const options = {
  host: '0.0.0.0',
  port: 3002,
  timeout: 2000,
  path: '/api/health',
}

const healthCheck = http.request(options, (res) => {
  if (res.statusCode === 200)
    process.exit(0)
  else
    process.exit(1)
})

healthCheck.on('error', (e) => {
  process.exit(1)
})

healthCheck.end()
