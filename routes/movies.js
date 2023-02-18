const express = require('express');
const router = express.Router();

//* Models
const Movie = require('../models/Movie');

router.get('/',(req,res)=>{  //Butun filmleri getiren endpoint
  const promise = Movie.find({ });
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

router.get('/:movie_id', (req,res,next)=>{       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie)=>{
    if(!movie)
      next({message: 'Movie was not found!', code: -1});
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });
});

router.put('/:movie_id', (req,res,next)=>{       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
    {
      new: true,
    }
    );

  promise.then((movie)=>{
    if(!movie)
      next({message: 'Movie was not found!', code: -1});
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });
});

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
