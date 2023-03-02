const router = require("express").Router()
const userCtrl = require("../controler/userCtrl")

router
.route('/user')
.post(userCtrl.createUser)
.get(userCtrl.getAllUsers)

router
.route('/user/:id')
.delete(userCtrl.deleteUser)
module.exports = router