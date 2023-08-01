const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");
const router = express.Router();

//-------------- VALIDATING INPUT DATA ---------------

const validateData = [
  //<------------- validating email --------------->
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value, { req }) => {
      //check for existing user
      /*
        this finding user code was optional as i already validate email by
        uniqe index but i did so just to follow course instructor
        */
      const existUser = await User.findOne({ email: value });
      if (existUser) {
        throw new Error("user with email already exists..");
      }
      return true;
    }),
  //<-------------- validating password ------------->
  body("password", "alpha numeric password atleast 8 characters")
    .isLength({ min: 8 })
    .isAlphanumeric(),
  //checking  passwords equality......
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password does not match");
    }
    return true;
  }),
];

//================== HANDLING ROUTES ============================
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", validateData, authController.postSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

//reset passwrord
router.get("/reset", authController.getResetPassword);
//post reset password
router.post("/reset", authController.postResetPassword);
//get new password page
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password/", authController.postNewPassword);

module.exports = router;
