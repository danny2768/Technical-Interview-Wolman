import mongoose, { mongo } from "mongoose";

const addressSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "ownerModel",
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ["Client", "User"], // Allows referencing different models
    },
    streetAddress: {
        type: String,
        required: true 
    }, 
    city: { 
        type: String,
        required: true 
    },
    department: { 
        type: String,
        required: true 
    },
    country: { 
        type: String,
        required: true 
    }
});

addressSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) { // Remove _id from the response
        delete ret._id;
    }
});

export const AddressModel = mongoose.model("Address", addressSchema);