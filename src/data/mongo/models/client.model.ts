import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    documentType: {
        type: String,
        enum: ["CC", "CE", "TI", "NIT"], // If modified, also modify the dtos & the type
        required: [ true, "documentType is required" ],
    },
    documentNumber: {
        type: String,
        required: [ true, "documentNumber is required" ],
        unique: true,
    },
    firstName: {
        type: String,
        required: [ true, "firstName is required" ],
    },
    secondName: {
        type: String,
    },
    firstSurname: {
        type: String,
        required: [ true, "firstSurname is required" ],
    },
    secondSurname: {
        type: String,
    },
    birthDate: {
        type: Date,
        required: [ true, "birthDate is required" ],
    },    
})

clientSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) { // Remove _id from the response
        delete ret._id;
    }
});

export const ClientModel = mongoose.model("Client", clientSchema);