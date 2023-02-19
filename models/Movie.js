const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: [true, '`{PATH}` alani zorunludur'], //! {PATH} kismi title kismini verecektir
        maxlength: [50, '`{PATH}` alani {MAXLENGHT} karakterden uzun olamaz!'],
        minlenght: [1, '`{PATH}` alani {MINLENGHT} karakterden kisa olamaz']  //! sartlarin saglanmadigi durumda bunlar hata mesaji olarak yazilacaktir
    },
    category: String,
    country: String,
    year: Number,
    imdb_score: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);
