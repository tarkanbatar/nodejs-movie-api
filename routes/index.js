const express = require('express');
const router = express.Router();

//* Models
const User = require('../models/User');

//* Bcrypt importation
const bcrypt = require('bcryptjs');

//* JWT
const jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username,   //? username=this.username yapmak yerine direkt bu sekilde kullanabiliyoruz
      password: hash    //! bu hashlenmis sifrenin cozulmesi icin de compare methodu kullanilir bcryptjs compare diye aratirsak nasil kullanildigi gorulecektir.
    });

    const promise = user.save();
    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });

  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err)
      throw err;
    if (!user) {
      res.json({
        statur: false,
        message: 'Authentication failed!'
      });
    } else {
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          res.json({
            status: false,
            message: "Wrong password!"
          });
        } else {
          const payload = { username };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 720        //! bu dakika cinsindendir, 12 saate tekabul eden degeri verdik burda
          });

          res.json({
            status: true,
            token
          });
        }
      });
    }
  });
});


module.exports = router;