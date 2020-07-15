const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
            Title: {type: String,required: true},
            Year: {type: String,required: true},
            Released: {type: String,required: true},
            Genre: {type: String,required: true},
            Director:{type: String,required: true},
            Awards: {type: String,required: true},
            imdbID: {type: String,required: true},
            Type: {type: String,required: true},
            Ratings: {type: Array,required: true}
});

module.exports = mongoose.model('Movie', MovieSchema );