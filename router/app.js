const { Router } = require("express")
const router = Router()
const rutasApp = require('../controllers/metodosApp')

router.get("/login",rutasApp.formLoggin)
router.post("/login",rutasApp.validateLoggin)
router.post("/register",rutasApp.register)
router.get("/salir",rutasApp.salir)

router.get("/store",rutasApp.getStore)
router.post("/store",rutasApp.postStore)

router.get("/view",rutasApp.view)

module.exports = router;