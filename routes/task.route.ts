import express from 'express';
import { taskModel } from '../models/task.schema';
import { teamModel } from '../models/team.schema';
import { userModel } from '../models/user.schema';

const router = express.Router();

router.get('/get', async function(req, res, next) {
  try {
    const page = parseInt(req.query.page as string || '0');
    const size = parseInt(req.query.size as string || '10');
    const search = req.query.search as string;
    const assigneeId = req.query.assignee as string;
    const teamId = req.query.team as string;
    
    const searchRegx = new RegExp(search, 'i');
    const filterQuery = [];

    if (assigneeId) filterQuery.push({ assignee: assigneeId });
    if (teamId) filterQuery.push({ team: teamId });
    if (search) filterQuery.push({
      $or: [
        { title: searchRegx },
        { desc: searchRegx }
      ]
    });

    const query: any = { };
    if (filterQuery.length) query['$and'] = filterQuery;
  
    const count = await taskModel.count().exec();
    const taskList = await taskModel.find(query)
      .select('-__v')
      .populate('assignee', '-__v')
      .populate({
        path: 'team',
        model: 'Team',
        populate: {
          path: 'members',
          model: 'User',
          select: '-__v'
        }
      })
      .limit(size)
      .skip(size * page)
      .exec();
  
    res.json({
      status: true,
      data: taskList,
      message: 'success',
      total: count
    });
  }

  catch(err) {
    res.json({
      status: false,
      data: [],
      message: err,
      total: 0,
    })
  }
});

router.get('/get/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const task = await taskModel.findById(id)
      .select('-__v')
      .populate('assignee')
      .populate({
        path: 'team',
        model: 'Team',
        populate: {
          path: 'members',
          model: 'User',
          select: '-__v'
        }
      });

    if (!task) throw('Task not found');
    
    return res.json({
      status: true,
      data: task,
      message: 'success'
    });
  }

  catch(err) {
    return res.status(500).json({
      status: false,
      message: err,
      data: null
    });
  }
});

router.post('/create', async function(req, res, next) {
  try {
    const title: string = req.body.title;
    const desc: string = req.body.desc;
    const due: number = req.body.due;
    const teamId: string = req.body.team;
    const assigneeId: string = req.body.assignee;

    const team = await teamModel.findById(teamId);
    if (!team) throw('Team not found');

    const assignee = await userModel.findById(assigneeId);
    if (!assignee) throw('Assignee not found');

    const task = new taskModel({
      title,
      desc,
      due: new Date(due),
      team: teamId,
      assignee: assigneeId
    });

    const save = await task.save();
    return res.json({
      status: true,
      data: save,
      message: 'success'
    })
  }

  catch(err) {
    res.json({
      status: false,
      data: null,
      message: err,
    })
  }
});

router.post('/update/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const title: string = req.body.title;
    const desc: string = req.body.desc;
    const due = new Date(req.body.due);

    const task = await taskModel.updateOne({ id }, {
      title, desc, due
    });

    return res.json({
      status: true,
      data: task,
      message: 'success'
    });
  }

  catch(err) {
    return res.json({
      status: false,
      data: null,
      message: err,
    });
  }
});

router.delete('/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const del = await taskModel.findOneAndDelete({ _id: id });
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
      message: err,
    });
  }
});

module.exports = router;