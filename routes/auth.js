const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
// const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../expressError");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
 router.post("/login", async function (req, res, next) {
    try {
      let {username, password} = req.body;
      // if the username and password match from req.body
      if (await User.authenticate(username, password)) {
        let token = jwt.sign({username}, SECRET_KEY); // sign token
        // User.updateLoginTimestamp(username);
        return res.json({token});   // return the token should be True
      } else {
        throw new ExpressError("Invalid username/password", 400);
      }
    }
  
    catch (err) {
      return next(err);
    }
  });
  

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
 router.post('/register', async (req, res, next) => {
    // was confused by refactoring to OOP, solution here, instead will explian what it does

    try {
        //extracting/ destructuring username from User that is registering
         let {username} = await User.register(req.body);
       
         //creating a token using extracted username from body of request
         let token = jwt.sign({username}, SECRET_KEY);
        
         // return the token on register
         return res.json({token});
    } catch (e){
        return next(e)
    }
});

module.exports = router;