const approuter = require("express").Router();
const multer = require("multer");
const path = require("path");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const Project = require("../model/project");
const Skill = require("../model/skill");
// Set up multer storage for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// contact
approuter.post("/contact",  async (req, res) => {
  try {
    const { email,number,message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
    // Set up your email transporter options (e.g., SMTP, Gmail)

    const mailOptions = {
      from: email,
      to: process.env.email,
      subject: "contact",
      text: `hello --
      ${message} \n 
      our phone number is :: ${number}`,
    };
    await transporter.sendMail(mailOptions);

    res.render("error", {
      message: "mail send successfully ...",
    });
    // 
  
  } catch (error) {
    res.render("error", {
      message: "mail not send some problem accure contact us on different platform",
    });
  }
});

// Define a route for the homepage
approuter.get("/", async (req, res) => {
  try {
    const data = await Project.find();
    const team = await User.find({ role: "admin" });
    const skill = await Skill.find();
      res.render("index", { data, team, skill });
  } catch (error) {
    res.render("error", {
      message: "internal server error",
    });
  }
});

//   register page
approuter.get("/register", (req, res) => {
  res.render("register");
});

approuter.post("/register", upload.single("profile"), async (req, res) => {
  try {
    const { username, email, profession, lock } = req.body;


    const profile = req.file ? req.file.filename : "";

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.render("error", {
        message: "User already exists",
      });
    }

    // Hash the password
    const password = await bcrypt.hash(lock, 10);

    // Create a new user
    const user = new User({
      username: username,
      email: email,
      profile: profile,
      profession: profession,
      password: password,
    });

    const save = await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("yuva", token, { maxAge: 900000, httpOnly: true });

    res.render("error", {
      message: "registered and logged successfully",
    });
  } catch (error) {
    res.render("error", {
      message: "internal server error",
    });
  }
});
approuter.get("/login", (req, res) => {
  res.render("login");
});

//   login page
approuter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.render("error", {
        message: "user not exist ",
      });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.render("error", {
        message: "unauthorized user pass",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("yuva", token, { maxAge: 900000, httpOnly: true });

    res.render("error", {
      message: "logged successfully",
    });
  } catch (error) {
    res.render("error", {
      message: "unauthorized user last",
    });
  }
});

approuter.get("/logout", (req, res) => {
  res.cookie("yuva", "");
  res.render("error", {
    message: "logouted",
  });
});

// forrget form
approuter.get("/forget-password", (req, res) => {
  res.render("forget");
});
// Handle password reset request
approuter.post("/forgot-password", async (req, res) => {
  // Generate a password reset token and expiration time
  const token = randomstring.generate();
  const expirationTime = Date.now() + 3600000; // 1 hour from now

  try {
    // Find the user by their email address
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Handle error if the user does not exist
      return res.render("error", {
        message: "user not exist",
      });
    }

    // Update the user's reset password token and expiration time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expirationTime;

    // Save the updated user to the database
    await user.save();

    // Send an email with the password reset instructions
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
    // Set up your email transporter options (e.g., SMTP, Gmail)

    const mailOptions = {
      from: "yuvatechsolutions",
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/reset-password/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await transporter.sendMail(mailOptions);

    res.render("error", {
      message: "Password reset instructions sent to your email",
    });
  } catch (err) {
    res.render("error", {
      message: "Internal server error",
    });
  }
});

// Handle password reset link
approuter.get("/reset-password/:token", (req, res) => {
  const resetToken = req.params.token;
  // Render a form to allow users to enter and confirm their new password
  res.render("reset-password-form", { token: resetToken });
});
approuter.post("/reset-password/:token", async (req, res) => {
  try {
    // Find the user by the reset password token and check if it has expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      // Handle error if the token is invalid or has expired
      return(
      res.render("error", {
        message: "Invalid or expired token",
      })) }

    // Update the user's password with the new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user to the database
    await user.save();

    // Send a success response
    res.render("error", {
      message: "Password reset successfully",
    });
  } catch (err) {
   
    res.render("error", {
      message: "Internal server error",
    });
  }
});

//   404 page not found
approuter.get("/*", (req, res) => {
  res.render("error", {
    message: "404 page not found",
  });
});

module.exports = approuter;
