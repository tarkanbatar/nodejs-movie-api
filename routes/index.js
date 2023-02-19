const express = require('express');
const router = express.Router();

//* Models
const User = require('../models/User');

//* Bcrypt importation
const bcrypt = require('bcryptjs'); 

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
  const { username, password} = req.body;

  bcrypt.hash(password, 10).then((hash)=>{
    const user = new User({
      username,   //? username=this.username yapmak yerine direkt bu sekilde kullanabiliyoruz
      password: hash    //! bu hashlenmis sifrenin cozulmesi icin de compare methodu kullanilir bcryptjs compare diye aratirsak nasil kullanildigi gorulecektir.
    });
  
    const promise = user.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });

  });


});

module.exports = router;
