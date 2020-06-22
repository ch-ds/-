const express = require('express')
const rightsController = require('../controllers/rightsController')

const router = express.Router()

router.get('/rights',rightsController.getRights)
router.get('/rights/tree',rightsController.getRightsByTree)


module.exports = router