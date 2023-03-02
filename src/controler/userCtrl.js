const cloudinary = require('cloudinary')
const User = require('../models/userModel')
const dotenv = require('dotenv')
const fs = require('fs')
const { log } = require('console')

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})


const userCtrl = {
  createUser: async (req, res) => {
    try {
      const {email} = req.body
      try {
        const user = await User.findOne({email})
        const file = req.files.image

        if(user) {
            removeTemp(file.tempFilePath)
          return res.status(400).json({message: "This email already exists!"})
        }

        if(file.size > 10 * 1024 * 1024) {
          return res.status(401).json("image's size large 10mb")
        }

        if(file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
          return res.status(401).json("image format wrong!")
        }

        
        await cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "Exam App"}, async(err, result)=>{
          if(err){
            console.log(err);
          }
          removeTemp(file.tempFilePath)
          req.body.image = {public_id: result.public_id, url: result.secure_url}
        })
                
        const newUser = new User(req.body)

        await newUser.save()

        res.status(201).json({message: "user created successfully!", newUser})
        
      } catch (error) {
        const user = await User.findOne({email})

        if(user) {
          return res.status(400).json({message: "This email already exists!"})
        }

        const newUser = new User(req.body)

        await newUser.save()

        res.status(201).json({message: "user created successfully!", newUser})
      }

    } catch (error) {
      res.status(403).json(error)
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({})
      
      res.status(200).json({message: "Users list", users})
    } catch (error) {
      res.status(403).json(error)
    }

  },

  deleteUser: async (req, res) => {
    try {
      const {id} = req.params

      const deletedUser = await User.findByIdAndDelete(id)

      if(deletedUser.image.public_id){
        await cloudinary.v2.uploader.destroy(deletedUser.image.public_id,(err, result) => {
          if(err){
            console.log(err);
          }else{
            console.log();
          }
        })
      }

      if(deletedUser) {
        return res.status(200).json({message: "user deleted successfully", deletedUser})
      }

      res.status(404).json({message: "user not found"})

    } catch (error) {
      res.status(403).json(error)
    }
  }
}

function removeTemp(path) {
  fs.unlink(path, (err)=>{
    if(err) throw err;
  })
}

module.exports = userCtrl