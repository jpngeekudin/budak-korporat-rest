import express from 'express';
import { progressModel } from '../models/progress.schema';
import { taskModel } from '../models/task.schema';
const router = express.Router();

router.get('/get', async function(req, res, next) {
  try {
    const page = parseInt(req.query.page as string || '0');
    const size = parseInt(req.query.size as string || '10');
    const search = req.query.search as string;
    const taskId = req.query.task as string;

    const filter = [];
    if (taskId) filter.push({ task: taskId });
    if (search) {
      const regx = new RegExp(search, 'i');
      filter.push({ desc: regx });
    }

    const query: any = { };
    if (filter.length) query['$and'] = filter;

    const total = await progressModel.count();
    const progresses = await progressModel.find(query)
      .select('-__v')
      .populate('task', '-__v')
      .limit(size)
      .skip(size * page);

    res.json({
      status: true,
      data: progresses,
      message: 'success',
      total: total,
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

router.get('/get/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const progress = await progressModel.findById(id)
      .select('-__v')
      .populate({
        path: 'task',
        model: 'Task',
        select: '-__v'
      });

    return res.json({
      status: true,
      data: progress,
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
    const taskId: string = req.body.task;
    const desc: string = req.body.desc;

    const task = await taskModel.findById(taskId); 
    if (!task) throw('Task not found');

    const progress = new progressModel({ task: taskId, desc });
    const create = await progress.save();

    return res.json({
      status: true,
      data: create,
      messagae: 'success'
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
    const taskId: string = req.body.task;
    const desc: string = req.body.desc;

    if (taskId) {
      const task = await taskModel.findById(taskId);
      if (!task) throw('Task not found');
    }

    const update = await progressModel.updateOne({ _id: id }, {
      task: taskId, desc
    }, { runValidators: true });

    return res.json({
      status: true,
      data: update,
      message: 'success'
    });
  }

  catch(err) {
    return res.status(500).json({
      status: false,
      data: null,
      messaeg: err
    });
  }
});

router.delete('/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const del = await progressModel.deleteOne({ _id: id });
    return res.json({
      status: true,
      data: del,
      message: 'success'
    });
  }

  catch(err) {
    return res.status(500).json({
      status: false,
      data: null,
      message: err
    });
  }
})

module.exports = router;