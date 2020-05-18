const express = require("express");

const UserController = require("./controllers/user");

const router = express.Router();

router.get("/", UserController.index);

router.get("/users/:userId", UserController.findOne);

router.post("/users", UserController.insert);

module.exports = router;
