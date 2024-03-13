import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: String,
    email_verified: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        URL: String,
        documentRef: Schema.Types.ObjectId,
    },
    role: {
        type: String,
        required: true
    },
    banned: {
        type: Boolean,
        required: true,
        default: false
    },
    birthday: Date,

    email_verfication_token: String,
    reset_pasword_token: String
},
    { timestamps: true });

export const User = models.User || model("User", userSchema); 
