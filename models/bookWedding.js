const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var foodSchema = new Schema({
    food_type: {
        type: String,

        default: ""
    },
    drink_type: {
        type: String,
        default: ""
    },
    request_food: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});
/////
var musicSchema = new Schema({
    music: {
        type: String,
        default: ""
    },
    singer: {
        type: String,
        default: ""
    },
    request_music: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});
////
var photographySchema = new Schema({
        location: {
            type: String,
            default: ""
        },
        numberOfPhotos: {
            type: String,
            default: ""
        },
        datePhoto: {
            type: Date,
            default: ""
        },
        agree: {
            type: String,
            default: ""
        },
        request_photo: {
            type: String,
            default: ""
        },
    },

    {
        timestamps: true
    });
////
var avenueSchema = new Schema({
    Avenue: {
        type: String,
        default: ""
    },

}, {
    timestamps: true
});







var weddingShema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: false
    },
    time: {
        type: String,
        required: false,
    },
    budget: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: false
    },
    food: [foodSchema],
    music: [musicSchema],
    photography: [photographySchema],
    avenue: [avenueSchema]


}, {
    timestamps: true
});
var Weddings = mongoose.model('Wedding', weddingShema);

module.exports = Weddings;