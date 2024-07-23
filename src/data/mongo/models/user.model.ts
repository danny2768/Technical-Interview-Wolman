import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },    
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        enum: ['SUPER_ADMIN_ROLE','ADMIN_ROLE', 'USER_ROLE'],
    },
}, {    
    timestamps: true,
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const UserModel = mongoose.model('User', userSchema);
