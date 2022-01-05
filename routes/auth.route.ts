import express from 'express';
import { userModel } from '../models/user.schema';
import { generateJwt } from '../helpers/jwt.helper';

const router = express.Router();
router.post('/login', async function(req, res, next) {
  try {
    const username: string = req.body.username;
    const password: string = req.body.password;
  
    const user = await userModel.findOne({ username })
      .select('-__v');
      
    if (!user) throw('Username not found');
    if (user.password != password) throw('Wrong password');

    const jwt = generateJwt(user.username);

    return res.json({
      status: true,
      data: {
        ...user.toObject(),
        token: jwt
      },
      message: 'success'
    });
  }

  catch(err) {
    return res.json({
      status: false,
      data: null,
      message: err
    });
  }
});

module.exports = router;