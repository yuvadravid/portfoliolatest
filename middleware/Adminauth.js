const jwt = require("jsonwebtoken");
const User = require("../model/user");
const adminauth = async (req, res, next) => {
  try {
    const token = req.cookies.yuva;
   const {userId} =  await jwt.verify(token,process.env.JWT_SECRET);
   const user =await User.findById(userId)
   console.log(user)
   if(user.role != 'admin')
   {
    res.render("error", {
        message: "unauthorize user",
      });  
   }
    next();
  } catch (error) {
    console.log(error);
    res.render("error", {
      message: "unauthorize user",
    });
  }
};

module.exports = adminauth;
