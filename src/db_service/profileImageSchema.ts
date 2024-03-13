import mongoose, { Document, Model, Schema, model, models } from 'mongoose';
import { ObjectId } from "mongoose";
import { User } from './userSchema';

const profileImageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    imageData: {
        type: Buffer,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    }
});

export const ProfileImage = models.ProfileImage || model("ProfileImage", profileImageSchema); 
