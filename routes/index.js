import express from 'express';
import {myDB} from '../database/db.js';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

const secret = 'secret123';

/* GET home page. */
router.get('/', (req, res) => {
  res.send('hello world');
})

router.get('/user', async (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.token, secret);
    console.log(payload)
    const user = await myDB.getUserByID(payload.id);
    console.log(user)
    res.json({user});
    // Handle the user data and send the response
  } catch (error) {
    // Handle token verification error
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
})

router.post('/register', async (req, res) => {
  const {email, password} = req.body;
  const existingUser = await myDB.getUserByEmail(email);
  if (existingUser) return res.sendStatus(401);
  const hashedPassword = await bycrypt.hash(password, 10);
  const user = {email, hashedPassword};
  const data = await myDB.register(user);
  jwt.sign({id:data.insertedId,email:email}, secret, (err,token) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.cookie('token', token, ).json({id:data.insertedId,email:email});
    }
  });
})

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const user = await myDB.getUserByEmail(email);
  if(!user) return res.sendStatus(401);
  const verify = bycrypt.compareSync(password, user.password);
  if (verify) {
    jwt.sign({id:user._id,email:user.email}, secret, (err,token) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token, ).json({id:user._id,email:user.email});
      }
    });
  } else {
    res.sendStatus(401);
  }
})

router.post('/logout', (req, res) => {
  res.cookie('token', '').send()
})
export default router;
