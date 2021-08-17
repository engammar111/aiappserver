require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const cors = require("cors")
require("./models/users")

const app = express()
app.use(bodyParser.json())
app.use(cors())

const mongouri = process.env.MONGODBURI
mongoose.set("useFindAndModify", false)

const User = mongoose.model("User")

mongoose.connect(mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind("connection error"))
db.once("open", () => {
  console.log("connected to atlas")
})

app.get("/", async (req, res) => {
  try {
    const user = await User.find()
    res.json(user)
  } catch (error) {
    res.status(500).json({ "its connected" })
  }
})

app.post("/signup", async (req, res) => {
  const { name, password, email } = req.body

  const newuser = new User({
    name: name,
    password: password,
    email: email,
  })

  try {
    const result = await newuser.save()

    res.status(201).json(result)
  } catch {
    res.status(400).json(error)
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash("password", salt, function (err, hash) {})
  })
})

app.post("/login", async (req, res) => {
  const userEmail = await User.findOne({
    email: req.body.email,
  })
  const userPassword = await User.findOne({
    password: req.body.password,
  })
  try {
    if (!userEmail || !userPassword) {
      res.json("Wrong User or Password Login")
    } else {
      const user = await User.findOne(userEmail)
      res.json({ res: "valid", user: user })
    }
  } catch {
    res.status(400).json("error")
  }
})

app.get("/profile/:id", getUser, (req, res) => {
  res.json(res.user.password)
})

app.put("/imagecount", async (req, res) => {
  const { email } = req.body
  try {
    if (!email) {
      res.json("user not found imageCount")
    } else {
      const userId = await User.findByIdAndUpdate(
        email.match(/^[0-9a-fA-F]{24}$/),
        {
          $inc: { imageCounter: 1 },
        }
      )

      res.json(userId)
      userId.save()
    }
  } catch (error) {
    res.status(400).json({ "error bad request": error })
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`)
})

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).json("not Found User")
    }
  } catch (error) {
    res.status(500).json("error")
  }

  res.user = user

  next()
}
