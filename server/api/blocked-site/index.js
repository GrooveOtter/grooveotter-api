'use strict';

var express = require('express');
var controller = require('./blocked-site.controller');

var router = express.Router();

router.get('/:userId/blocked-sites', controller.index);
// router.get('/:id', controller.show);
router.post('/:userId/blocked-sites', controller.create);
router.put('/:userId/blocked-sites', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;