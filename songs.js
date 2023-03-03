let mongoose = require("mongoose")

// use mongoose to initialize schema
let mongoSchema = mongoose.Schema

// use mongoScheme to create reference to song collection
let songSchema = new mongoSchema({
        "videoid": String,
        "likes": Number,
        "dislikes": Number
}, {
    collection:"songs"
})

// export the model
module.exports = mongoose.model('songs', songSchema)