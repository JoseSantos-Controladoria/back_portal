const express = require('express');

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Welcome do Trade HUB',
    version: '1.0.0',
  });
});

module.exports = router;
