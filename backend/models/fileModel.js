import mongoose from "mongoose";

const fileScema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: {type: String, required:true},
    type: {type: String, default: ''},
    content: {type: String , default: ''},
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: 'file', default: null},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
},{timestamps: true});

const fileModel = mongoose.model.file || mongoose.model("file", fileScema)

export default fileModel;




