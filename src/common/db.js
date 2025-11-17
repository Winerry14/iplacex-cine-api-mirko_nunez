import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = "mongodb+srv://eva-u3-express:Realidad12.@cluster-express.3hfmbje.mongodb.net/?appName=Cluster-express"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

export default client