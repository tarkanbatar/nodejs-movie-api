const mongoose = require('mongoose');

module.exports = () =>{
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://127.0.0.1:27017/udemy?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1');
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connection Granted!');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Connection Failed!', err);
    });

    mongoose.Promise = global.Promise;
};