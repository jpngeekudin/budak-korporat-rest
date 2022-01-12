import express from 'express';
import { taskModel } from '../models/task.schema';

const router = express.Router();

router.get('/get', async function(req, res, next) {
  try {
    const assigneeId = req.query.assignee;

    const filterQuery = [];
    if (assigneeId) filterQuery.push({ assignee: assigneeId });

    const query: any = {};
    if (filterQuery.length) query['$and'] = filterQuery;

    const taskCount = await taskModel.find(query).count();
    const completeCount = await taskModel.find({
      '$and': [...filterQuery, { status: 'complete' }]
    }).count();
    const progressCount = await taskModel.find({
      '$and': [...filterQuery, { status: 'progress' }]
    }).count();
    const openCount = await taskModel.find({
      '$and': [...filterQuery, { status: 'open' }]
    }).count();

    const data = {
      total: taskCount,
      open: openCount,
      progress: progressCount,
      complete: completeCount
    };

    return res.json({
      status: true,
      data: data,
      message: 'success'
    });
  }

  catch(err) {
    res.status(500).json({
      status: false,
      data: null,
      message: err,
    });
  }
})

module.exports = router;