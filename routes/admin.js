const adminrouter = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const adminauth = require("../middleware/Adminauth");
const Project = require("../model/project");
const Skill = require("../model/skill");
const Client = require("../model/client");

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

// Define a route for the homepage
adminrouter.get("/project", adminauth, async (req, res) => {
  const data = await Project.find();

  res.render("adminproject", { data });
});

adminrouter.post(
  "/project",
  adminauth,
  upload.single("banner"),
  async (req, res) => {
    try {
      const { title, desc, url } = req.body;

     

      const banner = req.file ? req.file.filename : "";

      // Check if the user already exists

      // Create a new user
      const project = new Project({
        title,
        desc,
        url,
        banner,
      });

      const save = await project.save();

      res.render("error", {
        message: " uploaded successfully",
      });
    } catch (error) {
      res.render("error", {
        message: "internal server error",
      });
    }
  }
);

//
adminrouter.get("/project/:id", adminauth, async (req, res) => {
  try {
    const { id } = req.params;
    const d = await Project.findById(id);
    const imagePath = path.join(__dirname,"../", "public", "uploads", d.banner);
    fs.unlink(imagePath, (err) => {
      if (err) {
        
        res.render("error", {
          message: " deleted unsuccessfully",
        });
      } else {
        res.render("error", {
          message: " deleted successfully",
        });
      }
    });
    const data = await Project.deleteOne({ _id: id });
  } catch (e) {
    
    res.render("error", {
      message: " deleted successfully",
    });
  }
});

adminrouter.get("/skill/:id", adminauth, async (req, res) => {
  try {
    const { id } = req.params;
    const d = await Skill.findById(id);
    const imagePath = path.join(__dirname,"../", "public", "uploads", d.banner);
    fs.unlink(imagePath, (err) => {
      if (err) {
      
        res.render("error", {
          message: " deleted unsuccessfully",
        });
      } else {
        res.render("error", {
          message: " deleted successfully",
        });
      }
    });
    const data = await Skill.deleteOne({ _id: id });
  } catch (e) {
    res.render("error", {
      message: " deleted successfully",
    });
  }
});





adminrouter.get("/skill", adminauth, async (req, res) => {
  const data = await Skill.find();
  res.render("adminskill", { data });
});

adminrouter.post(
  "/skill",
  adminauth,
  upload.single("banner"),
  async (req, res) => {
    try {
      const { title, desc } = req.body;

      

      const banner = req.file ? req.file.filename : "";

      // Check if the user already exists

      // Create a new user
      const skill = new Skill({
        title,
        desc,
        banner,
      });

      const save = await skill.save();

      res.render("error", {
        message: " uploaded successfully",
      });
    } catch (error) {
      res.render("error", {
        message: "internal server error",
      });
    }
  }
);

// client data

adminrouter.get("/client", adminauth, async (req, res) => {
  const data = await Client.find();
  res.render("adminclient", { data });
});

adminrouter.post(
  "/client",
  adminauth,
  upload.single("banner"),
  async (req, res) => {
    try {
      const { title, desc } = req.body;


      const banner = req.file ? req.file.filename : "";

      // Check if the user already exists

      // Create a new user
      const client = new Client({
        title,
        desc,
        banner,
      });

      const save = await client.save();

      res.render("error", {
        message: " uploaded successfully",
      });
    } catch (error) {
      res.render("error", {
        message: "internal server error",
      });
    }
  }
);

//   404 page not found
adminrouter.get("/*", (req, res) => {
  res.render("error", {
    message: "404 page not found admin",
  });
});

module.exports = adminrouter;
