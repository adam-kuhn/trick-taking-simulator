const path = require('path')
const express = require('express')

const app = express()

const PORT = process.env.port || 3000

app.use(express.json())

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
