const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

const adminSchema = new Schema({
    username: { type: String, unique: true},
    email: { type: String, unique: true},
    password: String
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId   
});

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId 
});

const userSchema = new Schema({
    username: { type: String, unique: true},
    email: { type: String, unique: true },
    password: String
});

const adminModel = mongoose.model('admin', adminSchema);
const courseModel = mongoose.model('course', courseSchema);
const userModel = mongoose.model('user', userSchema);
const purchaseModel = mongoose.model('purchase', purchaseSchema);

module.exports = {
    adminModel,
    courseModel,
    userModel,
    purchaseModel
}

