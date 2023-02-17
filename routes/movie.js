const express = require('express');
const router = express.Router();

//* Models
const Movie = require('../models/Movie');

router.post('/', function(req, res, next) {
/*const { title, imdb_score, category, country, year } = req.body;

  const movie = new Movie({
    title: title,
    category: category,
    country: country,
    imdb_score: imdb_score,
    year: year
  }); */

  const movie = new Movie(req.body);   // dbye gondermek istedigimiz veriyi yukaridaki gibi ozellestirebildigimiz gibi bu sekilde de bir butun olarak gonderebiliriz.

/*   movie.save((err, data) => {
    if(err)
      res.json(err)
    
    res.send({ status: 1});
  }); PROMISE YAPISI KULLANMADAN BU SEKILDE DATABASE KAYITLARINI GERCEKLESTIREBILIRIZ. */

  const promise = movie.save();
  promise.then((data) => {
    res.json({status: 1});
  }).catch((err)=>{
    res.json(err);
  })
});

module.exports = router;
