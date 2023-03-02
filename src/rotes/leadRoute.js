const router = require("express").Router()
const leadCtrl = require("../controler/leadCtrl")

router
.route('/lead')
.post(leadCtrl.sendLead)


module.exports =router