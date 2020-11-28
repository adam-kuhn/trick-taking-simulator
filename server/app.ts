import express from 'express'
import routes from './routes'

const app = express()

const PORT = process.env.port || 3000

app.use(express.json())

app.use('/api', routes)

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
