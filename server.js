import express from 'express'
import cors from 'cors'
import client from './src/common/db.js'

import peliculaRoutes from './src/pelicula/routes.js'
import actorRoutes from './src/actor/routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  return res.json({ message: 'Bienvenido al cine Iplacex' })
})

app.use('/api', peliculaRoutes)
app.use('/api', actorRoutes)

const PORT = process.env.PORT || 3000 || 4000

async function startServer() {
  try {
    await client.connect()
    console.log("Conectado exitosamente a MongoDB Atlas")

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`)
    })

  } catch (e) {
    console.error("Error al conectar a MongoDB:", e)
    process.exit(1)
  }
}

startServer()