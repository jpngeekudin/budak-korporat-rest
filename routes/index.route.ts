import express from 'express';

const router = express.Router();
router.get('/', function(req, res, next) {
  return res.send('budak-korporat v0.0.1');
});

module.exports = router;
