const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
var cookieParser = require('cookie-parser');
const approuter = require("./routes/index")
const adminrouter = require("./routes/admin")
dotenv.config();

// database connectivity
// Connect to MongoDB
mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



// Set EJS as the view engine
port = process.env.PORT || 9000;
app.set("view engine", "ejs");
app.use(express.static("public"));
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded
app.use(cookieParser());
app.use('/admin',adminrouter)
app.use(approuter)




// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
