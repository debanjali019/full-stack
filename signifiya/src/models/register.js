const mongoose = require("mongoose");

const userdataSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true,
        trim: true
    },
    "regno": {
        type: String,
        required: true,
        trim: true
    },
    "email": {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    "phone": {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },
    "event": {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("userdata", userdataSchema);
