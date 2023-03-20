const express = require('express');

const router = require("express").Router();

const {getAllUsers,getUser, postUser, userUpdate, userDelete,} = require("../controllers/userController");

 //GET USERS
 router.route("/").get(getAllUsers)

 // GET USER

 router.route("/:id").get(getUser)

 // POST 
 router.route("/").post(postUser)

//UPDATE

 router.route("/:id").put(userUpdate)
 
//DELETE
router.route("/:id").delete(userDelete) 





module.exports = router;
