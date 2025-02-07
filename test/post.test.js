const { expect } = require("chai");
const mongoose = require("mongoose");
const Post = require("../models/post"); // Adjust path if needed

describe("Post Model Tests", () => {

    // ✅ Connect to a Test Database Before Running Tests
    before(async function () {
        await mongoose.connect("mongodb://127.0.0.1:27017/test_db", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // ✅ Clear the database before each test
    beforeEach(async function () {
        await Post.deleteMany({});
    });

    // ✅ Close the database connection after tests
    after(async function () {
        await mongoose.connection.close();
    });

    // Test cases for Post Model Schema
    describe("Post Schema Validation", () => {

        it("should successfully save a valid post", async () => {
            const postData = {
                donor: new mongoose.Types.ObjectId(), // Mock a donor ID
                title: "Fresh Homemade Pizza",
                description: "Delicious homemade pizza with fresh ingredients",
                quantity: "2 Large Pizzas",
                foodType: "Veg",
                dietaryCategory: "Vegan",
                containsNuts: false,
                expiryDate: new Date("2024-06-10"),
                pickupAddress: "123 Street, City",
                contactInfo: "123-456-7890",
            };
            const post = new Post(postData);
            const savedPost = await post.save();

            expect(savedPost._id).to.exist;
            expect(savedPost.donor).to.exist;
            expect(savedPost.title).to.equal(postData.title);
            expect(savedPost.foodType).to.equal("Veg");
            expect(savedPost.dietaryCategory).to.equal("Vegan");
            expect(savedPost.createdAt).to.exist;
        });

        it("should throw an error if donor ID is missing", async () => {
            const postData = {
                title: "Fresh Salad",
                description: "Healthy fresh salad",
                quantity: "1 Bowl",
                foodType: "Veg",
                dietaryCategory: "Vegetarian",
                expiryDate: new Date("2024-06-10"),
                pickupAddress: "456 Road, City",
                contactInfo: "987-654-3210",
            };
            let err;
            try {
                await new Post(postData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.donor).to.exist;
        });

        it("should throw an error if title is missing", async () => {
            const postData = {
                donor: new mongoose.Types.ObjectId(),
                description: "Delicious meal",
                quantity: "3 servings",
                foodType: "Non-Veg",
            };
            let err;
            try {
                await new Post(postData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.title).to.exist;
        });

        it("should throw an error if foodType is invalid", async () => {
            const postData = {
                donor: new mongoose.Types.ObjectId(),
                title: "Homemade Soup",
                description: "Warm and delicious",
                quantity: "1 liter",
                foodType: "UnknownType", // ❌ Invalid value
            };
            let err;
            try {
                await new Post(postData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.foodType).to.exist;
        });

        it("should set default values correctly", async () => {
            const postData = {
                donor: new mongoose.Types.ObjectId(),
                title: "Bread Loaf",
                description: "Fresh homemade bread",
                quantity: "1 loaf",
                foodType: "Veg",
            };
            const post = new Post(postData);
            const savedPost = await post.save();

            expect(savedPost.dietaryCategory).to.equal("None"); // Default value check
            expect(savedPost.containsNuts).to.be.false;
            expect(savedPost.createdAt).to.exist;
        });
    });
});
