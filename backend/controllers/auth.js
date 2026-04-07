const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//@desc     Register User
//@route    POST https://todo-app-655q.onrender.com/api/auth/register
//@access   Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//@desc     Login User
//@route    POST https://todo-app-655q.onrender.com/api/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//@desc     Log user out / clear cookie
//@route    GET https://todo-app-655q.onrender.com/api/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc     Get current logged in user
//@route    POST https://todo-app-655q.onrender.com/api/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc     Forgot password
//@route    POST https://todo-app-655q.onrender.com/api/auth/forgotpassword
//@access   Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "There is no user with that email",
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
    Please make a PUT request to: \n\n ${resetUrl} `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ error: "Email could not be sent" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc     Reset Password
//@route    PUT https://todo-app-655q.onrender.com/api/auth/resetpassword/:resettoken
//@access   Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
