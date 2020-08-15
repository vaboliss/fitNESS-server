const express = require("express");
const router = express.Router();
const User = require("../models/User");
const validation = require("../validation/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./UsersVerification/verifyToken");

router.post("/register", async (req, res) => {
  //Validate
  const { error } = validation.registerValidation(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  //Check if user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).json({ message: "User already exist" });
    return;
  }

  //Hash the passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).json({message: 'User has been created'});
  } catch (err) {
    res.status(400).json(err);
  }
});
router.post("/logout", verify,async (req,res) =>{


});
router.post("/login", async (req, res) => {
  // Validate input
  const { error } = validation.loginValidation(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  //Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }
  //Is password correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).json({ message: "Invalid credentials" });
  }

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token, "name": user.name });
});

router.get("/IsValidToken", verify, async (req, res) => {
  res.status(200).json({status: 'Ok'});
});
module.exports = router;
