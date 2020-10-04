const User = require("../model/userModel");
const Email = require("../config/email");
require("dotenv").config();

exports.registerNewUser = async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      user_image: req.body.user_image,
      phone_number: req.body.phone_number,
      email: req.body.email,
      role: req.body.role,
    });
    user.password = await user.hashPassword(req.body.password);
    let createdUser = await user.save();

    Email.SendEmail(
      createdUser.email,
      "Welocme to Company ",
      "<p>Hey " +
        createdUser.name +
        "</p><p>Welcome to " +
        process.env.COMPANY_NAME +
        ".</p><p> You can use the link below to change your password from default </p><p>Username: " +
        createdUser.email
    );

    res.status(200).json({
      msg: "New user created",
      data: createdUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.loginUser = async (req, res) => {
  const login = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    let user = await User.findOne({
      email: login.email,
    });
    //check if user exit
    if (!user) {
      res.status(400).json({
        type: "Not Found",
        msg: "Wrong Login Details",
      });
    }
    let match = await user.compareUserPassword(login.password, user.password);
    if (match) {

      const payload = { 
        _id: user._id,
        name: user.name,
        phone_number: user.phone_number,
        email: user.email,
        role: user.role,
        password: user.password,
        createdAt: user.createdAt,    
        updatedAt: user.updatedAt,    
        __v: user.__v,         
      };

      let token = await user.generateJwtToken(
        {
          payload
        },
        "secret",
        {
          expiresIn: 604800,
        },
      );
      if (token) {
        res.status(200).json({
          success: true,
          token: token,
          userCredentials: user,
        });
      }
    } else {
      res.status(400).json({
        type: "Not Found",
        msg: "Wrong Login Details",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      type: "Something Went Wrong",
      msg: err,
    });
  }
};

exports.defineDummyData = async (req, res) => {
  res.json({
    message: "Hello World",
  });
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({}).then();
  res.status(200).json({
    userInfo: users,
  });
  res.json({
    userInfo: users,
  });
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};
