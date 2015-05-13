'use strict';

var express = require('express');
var controller = require('./task.controller');

var router = express.Router();

router.get('/:userId/tasks', controller.index);
router.get('/:userId/tasks/:id', controller.show);
router.post('/:userId/tasks', controller.create);
router.put('/:userId/tasks/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:userId/tasks/:id', controller.destroy);

module.exports = router;