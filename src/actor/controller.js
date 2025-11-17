import { ObjectId } from 'mongodb'
import client from '../common/db.js'
import { Actor } from './actor.js'

const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas')

async function handleInsertActorRequest(req, res) {
  let data = req.body
  let peliculaOid

  try {
    peliculaOid = ObjectId.createFromHexString(data.idPelicula)
  } catch (e) {
    return res.status(500).send('ID de película no válido')
  }

  const pelicula = await peliculaCollection.findOne({ _id: peliculaOid })

  if (pelicula === null) {
    return res.status(404).send("La película asignada no existe")
  }

  let actor = Actor
  actor.idPelicula = data.idPelicula
  actor.nombre = data.nombre
  actor.edad = data.edad
  actor.estaRetirado = data.estaRetirado
  actor.premios = data.premios

  await actorCollection.insertOne(actor)
    .then((d) => {
      if (d === null) return res.status(400).send(d)
      return res.status(201).send(d)
    })
    .catch((e) => {
      return res.status(500).send({ code: e })
    })
}

async function handleGetActoresRequest(req, res) {
  await actorCollection.find({}).toArray()
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((e) => {
      return res.status(500).send({ code: e.code })
    })
}

async function handleGetActorByIdRequest(req, res) {
  let id = req.params.id
  try {
    let oid = ObjectId.createFromHexString(id)
    await actorCollection.findOne({ _id: oid })
      .then((data) => {
        if (data === null) return res.status(404).send(data)
        return res.status(200).send(data)
      })
      .catch((e) => { return res.status(500).send({ code: e.code }) })
  } catch (e) {
    return res.status(500).send('Id mal formado')
  }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
  let peliculaId = req.params.pelicula
  await actorCollection.find({ idPelicula: peliculaId }).toArray()
    .then((data) => {
      if (data === null) return res.status(404).send(data)
      return res.status(200).send(data)
    })
    .catch((e) => {
      return res.status(500).send({ code: e.code })
    })
}

export default {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest
}