const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//* Models
const Director = require('../models/Director');

router.get('/', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $lookup: {          //! Burada movies ile join islemi yapiyoruz
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies'    //! yukarida as: 'movies' ile alias verdigimiz veriyi kullanabilmek icin burada unwind icinde path ile belirtmemiz gerekiyor bu sekilde
                //*preserveNullAndEmptyArrays: true  bu satir da eklenirse joinde sartlari saglamayan ve eslesmeyen satirlar da gelecektir
            }
        },
        {
            $group: {       //! eger bu ifade kullanilmazsa join yapilan parametre ile eslesen butun kayitlar ayri ayri kayit olarak gosterilecektir
                //! yani bizim projede yaptigimiz bir directore ait her bir film ayri ayri kayitlar halinde gelecektir fakat group islemi yaparak 
                //! bunlarin her birini tek kayit altinda toplayabiliyoruz. Burada gormek istedigimiz formati belirliyoruz.
                _id: {
                    _id: '_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'   //! unwind icindeki data ne ise buraya yazilacak
                }
            }
        },
        //! eger donen response icinde id basliginin '_id' olarak gorunmesini istemiyorsak $project ile degistiririz
        {
            $project: {
                _id: '_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ]);

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/:director_id', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id),
            }
        },
        {
            $lookup: {          //! Burada movies ile join islemi yapiyoruz
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies'    //! yukarida as: 'movies' ile alias verdigimiz veriyi kullanabilmek icin burada unwind icinde path ile belirtmemiz gerekiyor bu sekilde
                //*preserveNullAndEmptyArrays: true  bu satir da eklenirse joinde sartlari saglamayan ve eslesmeyen satirlar da gelecektir
            }
        },
        {
            $group: {       //! eger bu ifade kullanilmazsa join yapilan parametre ile eslesen butun kayitlar ayri ayri kayit olarak gosterilecektir
                //! yani bizim projede yaptigimiz bir directore ait her bir film ayri ayri kayitlar halinde gelecektir fakat group islemi yaparak 
                //! bunlarin her birini tek kayit altinda toplayabiliyoruz. Burada gormek istedigimiz formati belirliyoruz.
                _id: {
                    _id: '_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'   //! unwind icindeki data ne ise buraya yazilacak
                }
            }
        },
        //! eger donen response icinde id basliginin '_id' olarak gorunmesini istemiyorsak $project ile degistiririz
        {
            $project: {
                _id: '_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ]);

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.put('/:director_id', (req, res, next) => {       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
    const promise = Director.findByIdAndUpdate(
        req.params.director_id,
        req.body,
        {
            new: true,
        }
    );
    promise.then((director) => {
        if (!director)
            next({ message: 'Director was not found!', code: -1 });
        res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

/* router.get('/', (req, res) => {  //Butun filmleri getiren endpoint
  const promise = Director.find({});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
}); */

router.post('/', (req, res, next) => {
    const director = new Director(req.body);

    const promise = director.save();
    promise.then((data) => {
        res.json({ status: 1 });
    }).catch((err) => {
        res.json(err);
    });
});

router.delete('/:director_id', (req, res, next) => {       //URL'de gonderilen id numarasi req.params degiskenine dusecek ve biz bu bilgiye oradan ulasip kullanacagiz.
    const promise = Director.findByIdAndRemove(req.params.director_id, { new: true });
    promise.then((director) => {
        if (!director)
            next({ message: 'Director was not found!', code: -1 });
        res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;