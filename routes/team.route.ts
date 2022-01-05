import express from 'express';
import { teamModel } from '../models/team.schema';

const router = express.Router();

router.get('/get', async function(req, res, next) {
  try {
    const page = parseInt(req.query.page as string || '0');
    const size = parseInt(req.query.size as string || '10');
    const search = req.query.search as string;
    const leaderId = req.query.leader as string;
    const memberId = req.query.member as string;

    const filter = [];
    if (leaderId) filter.push({ leader: leaderId });
    if (memberId) filter.push({ members: { $in: [memberId] }});
    if (search) {
      const regx = new RegExp(search, 'i');
      filter.push({ name: regx });
    }

    const query: any = { };
    if (filter.length) query['$and'] = filter;
  
    const teamTotal = await teamModel.count();
    const teamList = await teamModel.find(query)
      .select('-__v')
      .limit(size)
      .skip(size * page)
      .populate('leader')
      .populate('members')
      .exec();
  
    return res.json({
      success: true,
      data: teamList,
      message: 'success',
      total: teamTotal
    });
  }

  catch(err) {
    return res.json({
      success: false,
      data: [],
      message: err
    });
  }
});

router.get('/get/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const team = await teamModel.findById(id)
      .select('-__v')
      .populate({
        path: 'leader',
        model: 'User',
        select: '-__v'
      })
      .populate({
        path: 'members',
        model: 'User',
        select: '-__v'
      })

    return res.json({
      status: true,
      data: team,
      messagae: 'success'
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
    const name: string = req.body.name;
    const leader: string = req.body.leader;
    const members: string[] = req.body.members;

    const team = new teamModel({ name, leader, members });
    const save = await team.save();

    return res.json({
      status: true,
      data: save,
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

router.post('/update/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const name: string = req.body.name;
    const leader: string = req.body.leader;
    const members: string[] = req.body.members;

    const update = await teamModel.updateOne({ _id: id }, {
      name, leader, members
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
      data: null,
      message: err
    });
  }
});

router.delete('/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const del = await teamModel.deleteOne({ _id: id });
    return res.json({
      status: true,
      data: del,
      message: 'success'
    });
  }

  catch(err) {
    return res.json({
      success: false,
      data: null,
      message: err
    });
  }
})

module.exports = router;