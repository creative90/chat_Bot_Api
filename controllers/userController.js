const Users = require('../models/userModels');
const asyncHandler = require('express-async-handler')


//GET USERS
const getAllUsers = asyncHandler( async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    status: 'success',
    message: 'users list compiled',
    data: {
      users,
    },
  });
});

// GET USER WITH ID

const getUser = asyncHandler(async(req, res) => {
  const id = req.params.id
  Users.findById(id)
      .then(user => {
          res.status(200).send(user)
      }).catch(err => {
          console.log(err)
          res.status(404).send(err)
      })
})

// POST
   const postUser = asyncHandler(async(req, res) => {
  const user = req.body
  user.lastUpdateAt = new Date() // set the lastUpdateAt to the current date
  Users.create(user)
      .then(user => {
          res.status(201).send(user)
      }).catch(err => {
          console.log(err)
          res.status(500).send(err)
      })
})
//UPDATE
const userUpdate = asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = req.body
    user.lastUpdateAt = new Date() // set the lastUpdateAt to the current date
    Users.findByIdAndUpdate(id, user, { new: true })
        .then(newUser => {
            res.status(200).send(newUser)
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
})

//DELETE
const userDelete = asyncHandler (async(req, res) => {
    const id = req.params.id
    Users.findByIdAndRemove(id)
        .then(user => {
            res.status(200).send(user)
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
})


module.exports = {getAllUsers, getUser, postUser, userUpdate, userDelete, };