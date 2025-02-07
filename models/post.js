const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // Only donors can create posts
    },
    title: {
        type: String,
        required: [true, "Please enter the title of the post"],
    },
    description: {
        type: String,
        required: [true, "Please enter the description"],
    },
    quantity: {
        type: String,
        required: [true, "Please enter the quantity"],
    },
    foodType: {
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true,
    },
    dietaryCategory: {
        type: String,
        default: "None",
    },
    containsNuts: {
        type: Boolean,
        default: false,
    },
    ingredients: {
        type: String,
    },
    additionalDescription: {
        type: String,
    },
    expiryDate: {
        type: Date,
    },
    storageInstructions: {
        type: String,
    },
    servingSize: {
        type: String,
    },
    preparationDate: {
        type: Date,
    },
    allergenInfo: {
        type: String,
    },
    packagingType: {
        type: String,
    },
    reheatingInstructions: {
        type: String,
    },
    certification: {
        type: String,
    },
    pickupAddress: {
        type: String,
    },
    landmark: {
        type: String,
    },
    contactInfo: {
        type: String,
    },
    pickupTimeSlot: {
        type: String,
    },
    foodImage: {
        type: String, // URL or path to the image
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", PostSchema);