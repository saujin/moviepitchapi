'use strict';

let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema;

let Pitch = new Schema({
    genre: String,
    pitchText: String,
    status: {
        type: String,
        default: 'created'
    },
    submitterEmail: String,
    submitterPhone: String,
    paid: {
        type: Date,
        default: null,
        validate: {
            validator: function () {
                return true; //to be implemented
            },
            message: "Not a valid date"
        }
    },
    dateRejected: {
        type: Date,
        default: null
    },
    dateAccepted: {
        type: Date,
        default: null
    },
    dateReviewed: {
        type: Date,
        default: null
    },
    paymentToken: {
        type: Object,
        default: null
    },
    userHasAcceptedTerms: {
        type: Boolean,
        default: false
    },
    termsAcceptedTime: Date,
    isLocked: {
        type: Boolean,
        default: false
    }
}, { collection: 'pitches' });

Pitch.plugin(mongoosePaginate);

module.exports = mongoose.model('Pitch', Pitch);
