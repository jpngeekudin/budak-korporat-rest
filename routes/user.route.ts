import express from 'express';
import { userModel } from '../models/user.schema';

const router = express.Router();

router.get('/get', async function(req, res, next) {
  try {
    const page = parseInt(req.query.page as string || '0');
    const size = parseInt(req.query.size as string || '10');
    const search = req.query.search as string;
    const username = req.query.username as string;
    const role = req.query.role as string;

    const filter = [];
    if (username) filter.push({ username });
    if (role) filter.push({ role });
    if (search) {
      const regx = new RegExp(search, 'i');
      filter.push({ username: regx });
    }

    const query: any = { };
    if (filter.length) query['$and'] = filter;
  
    const userTotal = await userModel.count();
    const userList = await userModel.find(query)
      .select('-__v')
      .limit(page)
      .skip(page * size)
      .exec();

    return res.json({
      status: true,
      data: userList,
      total: userTotal,
    })
  }

  catch(err) {
    return res.json({
      status: false,
      data: [],
      message: err
    });
  }
});

router.get('/get/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id)
      .select('-__v');

    return res.json({
      status: true,
      data: user,
      message: 'success'
    });
  }

  catch(err) {
    return res.status(500).json({
      status: false,
      data: null,
      message: err
    })
  }
})

router.post('/create', async function(req, res, next) {
  try {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const role: string = req.body.role;

    const user = new userModel({ username, password, role });
    const save = await user.save();

    return res.json({
      status: true,
      data: save,
      message: 'success'
    });
  }

  catch(err) {
    return res.json({
      status: false,
      data: [],
      message: err,
    })
  }
});

router.post('/update/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const username: string = req.body.username;
    const password: string = req.body.password;
    const role: string = req.body.role;

    const update = await userModel.findOneAndUpdate({ _id: id }, {
      username, password, role
    }, { runValidators: true });

    return res.json({
      status: true,
      data: update,
      message: 'success'
    });
  }

  catch(err) {
    return res.json({
      status: false,
      data: [],
      message: err
    });
  }
});

router.delete('/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const del = await userModel.deleteOne({ _id: id });
    return res.json({
      status: true,
      data: del,
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
})

module.exports = router;