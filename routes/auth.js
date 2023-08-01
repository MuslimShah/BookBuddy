const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const router = express.Router();

//-------------- VALIDATING INPUT DATA ---------------


const validateData = [
    body("email")
  .isEmail()
  .withMessage("Invalid email"),
  body("password", "alpha numeric password atleast 5 characters")
    .isLength({ min: 8 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    console.log("hasdhfasofhsdfhsdih");

    if (!value === req.body.password) {
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
