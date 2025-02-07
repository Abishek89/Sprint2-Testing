const { expect } = require("chai");
const mongoose = require("mongoose");
const User = require("../models/user"); // Adjust path if needed

describe("User Model Tests", () => {

    // ✅ Connect to a Test Database Before Running Tests
    before(async function () {
        await mongoose.connect("mongodb://127.0.0.1:27017/test_db", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // ✅ Clear the database before each test
    beforeEach(async function () {
        await User.deleteMany({});
    });

    // ✅ Close the database connection after tests
    after(async function () {
        await mongoose.connection.close();
    });

    // Test cases for User Model Schema
    describe("User Schema Validation", () => {

        it("should successfully save a valid user", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "securepassword",
                role: "donor",
            };
            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).to.exist;
            expect(savedUser.name).to.equal(userData.name);
            expect(savedUser.email).to.equal(userData.email);
            expect(savedUser.password).to.equal(userData.password);
            expect(savedUser.role).to.equal("donor");
        });

        it("should throw an error if name is missing", async () => {
            const userData = {
                email: "test@example.com",
                password: "securepassword",
                role: "beneficiary",
            };
            let err;
            try {
                await new User(userData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.name).to.exist;
        });

        it("should throw an error if email is missing", async () => {
            const userData = {
                name: "Alice Doe",
                password: "securepassword",
                role: "donor",
            };
            let err;
            try {
                await new User(userData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.email).to.exist;
        });

        it("should throw an error if password is missing", async () => {
            const userData = {
                name: "Alice Doe",
                email: "alice@example.com",
                role: "donor",
            };
            let err;
            try {
                await new User(userData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.password).to.exist;
        });

        it("should throw an error if role is invalid", async () => {
            const userData = {
                name: "Bob Smith",
                email: "bob@example.com",
                password: "securepassword",
                role: "invalidRole", // ❌ Invalid value
            };
            let err;
            try {
                await new User(userData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.role).to.exist;
        });

        it("should enforce unique constraint on email", async () => {
            const userData = {
                name: "John Doe",
                email: "unique@example.com",
                password: "securepassword",
                role: "donor",
            };
            await new User(userData).save();

            let err;
            try {
                await new User(userData).save(); // Trying to save the same email again
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.code).to.equal(11000); // Duplicate key error
        });
    });
});
