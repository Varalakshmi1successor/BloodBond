import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    bloodGroup: {
        type: String,
        required: true,
        index: true  
    },
    district: {
        type: String,
        required: true,
        index: true  
    },
    state: {
        type: String,
        required: true,
        index: true  
    },
});

const User = mongoose.model('User', UserSchema);

export default User;
