const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../../../common/config/config');

const tokenSchema = new Schema({
    walletAddress: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refreshToken : {
        type :String,
    },
    accessToken : {
        type: String,
    },
    expiry : {
        type : Date,
        default : Date.now() + (config.jwt.refreshExpirationDays) * 24 * 60 * 60 * 1000
    }
},
{
    timestamps : true
});


const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
