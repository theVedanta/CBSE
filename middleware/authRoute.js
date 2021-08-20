const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

// module.exports = (req, res, next) => {
//     const token = req.cookies.verify;
//     if (!token) {
//         res.redirect("/auth/login")
//     }
//     try {        
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//     } catch(err) {
//         console.log(err);
//         res.status(400);
//     }
//     next()  
// }

module.exports = (req, res, next) => {
    let token = req.cookies.verify;
  
    if (token == null) {
      res.redirect("/auth/login");
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          res.redirect("/auth/login");
        } else {
          req.user = user;
          next();
        }
      });
    }
  }