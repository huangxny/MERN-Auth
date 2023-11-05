import {MongoClient, ObjectId} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

function myDb(){
  const me = {};
  const mongoUrl = process.env.MONGODB_URI;
  const connect = async () => {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = await client.db('mern-auth');
    return {client, db};
  };

  me.register = async (user) => {
    const {client, db} = await connect();
    const userCollection = db.collection('user');
    const res = await userCollection.insertOne({email: user.email, password: user.hashedPassword});
    try {
      return res;
    } finally {
      await client.close();
    }
  }

  me.getUserByID = async (id) => {
    const {client, db} = await connect();
    const userCollection = db.collection('user');
    const res = await userCollection.findOne({_id: new ObjectId(id)});
    try {
      return res;
    } finally {
      await client.close();
    }
  }

  me.getUserByEmail = async (email) => {
    const {client, db} = await connect();
    const userCollection = db.collection('user');
    const res = await userCollection.findOne({email: email});
    try {
      return res;
    } finally {
      await client.close();
    }
  }
  return me;
}

export const myDB = myDb();

