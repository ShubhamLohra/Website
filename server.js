const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: 'shubhamLohra',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/farmerDB", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set("useCreateIndex", true);

// const userSchema = {
//     name:{
//       type:String,
//       required:true,

//     },

//     phone:{
//       type:Number,
//       required:true

//     },

//     adhar:{
//       type:String,
//       required:true

//     },
//     address:{
//       type:String,
//       required:true

//     },
//     email:{
//       type: String,
//       required:true
//     },
//     password:{
//       type:String,
//       required:true
//     }


// };

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  address: String,
  username: String,
  phone: Number,
  Aadhar: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);

const farmerSchema = {

  adharno: {
    type: String,
    required: true
  },

  crops: {
    type: String,
    required: true
  },

  quantity: {
    type: String,
    required: true
  },

  price: {
    type: String,
    required: true
  }


};

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const Farmer = new mongoose.model("Farmer", farmerSchema);

app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
    const username = req.user.username;
    res.render("page3",{username});
  }
  else {
    res.render("page1");
  }
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.listen(process.env.port || 3000, function (req, res) {
  console.log("server started ")
});

app.post("/register", function (req, res) {

  User.register({
    username: req.body.name, 
    phone: req.body.number,
    adhar: req.body.adhar,
    address: req.body.adress,
    email: req.body.username,
  }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      console.log(user);
      res.redirect("/register");
    } else {
      console.log(user);
      const authenticate = User.authenticate();
      authenticate("username", "password", function (err, result) {
        if (err) {
          res.redirect("/register");
        }
        else {
          res.redirect("/login");
        }
      })
      //   passport.authenticate("local")(req, res, function () {
      //     res.redirect("/login");

      //   });
    }
  });
  // const newUser = new User({
  //   username: req.body.name,
  //   phone: req.body.number,
  //   adhar: req.body.adhar,
  //   address: req.body.adress,
  //   email: req.body.username,
  //   password: req.body.password
  // });
  // newUser.save();
});


app.post("/post", function (req, res) {
  const newFarmer = new Farmer({

    adharno: req.body.adharno,
    crops: req.body.crops,
    quantity: req.body.quantity,
    price: req.body.price
  });

  newFarmer.save(function (err) {
    if (err) {
      console.log(err);
      res.render("errormessage");
    }
    else {
      console.log("updated successfully");
      res.render("post");
    }
  });

});

app.post("/login", function (req, res) {

  const user = new User({
    username: req.body.name,
    password: req.body.password
  })

  req.login(user, function (err,user) {
    if (err) {
      console.log(err);
      res.render("login");
    }

    else {

      // const username = user.username;

      if (req.isAuthenticated()) {
        console.log(req.body.name);
        const username = req.body.name;
        res.render("page3",{username});
      }
      else {
        console.log(user);
        res.redirect("/login");
      }


    }
  })
});
app.get("/page3", function (req, res) {
  res.render("page3");
})

app.get("/buyer", function (re, res) {
  res.render("buyer");
});

app.get("/cart", function (req, res) {
  res.render("cart");
})

app.get("/seller", function (req, res) {
  res.render("seller");
})
app.get("/errormessage", function (req, res) {
  res.render("errormessage");
})

app.get("/post", function (req, res) {
  res.render("post");
})

app.get("/profile", function (req, res) {
  res.render("profile");
})

app.get("/home", function (req, res) {
  res.render("home");
})

app.get("/logout",function(req,res)
{
  req.logout();
  res.render("page1");
})


