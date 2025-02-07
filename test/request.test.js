const { expect } = require("chai");
const mongoose = require("mongoose");
const Request = require("../models/request"); // Adjust path if needed

describe("Request Model Tests", () => {

    // ✅ Connect to a Test Database Before Running Tests
    before(async function () {
        await mongoose.connect("mongodb://127.0.0.1:27017/test_db", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // ✅ Clear the database before each test
    beforeEach(async function () {
        await Request.deleteMany({});
    });

    // ✅ Close the database connection after tests
    after(async function () {
        await mongoose.connection.close();
    });

    // Test cases for Request Model Schema
    describe("Request Schema Validation", () => {

        it("should successfully save a valid request", async () => {
            const requestData = {
                post: new mongoose.Types.ObjectId(), // Mock a Post ID
                beneficiary: new mongoose.Types.ObjectId(), // Mock a Beneficiary ID
                donor: new mongoose.Types.ObjectId(), // Mock a Donor ID
                status: "Pending",
            };
            const request = new Request(requestData);
            const savedRequest = await request.save();

            expect(savedRequest._id).to.exist;
            expect(savedRequest.post).to.exist;
            expect(savedRequest.beneficiary).to.exist;
            expect(savedRequest.donor).to.exist;
            expect(savedRequest.status).to.equal("Pending");
            expect(savedRequest.createdAt).to.exist;
        });

        it("should throw an error if post ID is missing", async () => {
            const requestData = {
                beneficiary: new mongoose.Types.ObjectId(),
                donor: new mongoose.Types.ObjectId(),
                status: "Accepted",
            };
            let err;
            try {
                await new Request(requestData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.post).to.exist;
        });

        it("should throw an error if beneficiary ID is missing", async () => {
            const requestData = {
                post: new mongoose.Types.ObjectId(),
                donor: new mongoose.Types.ObjectId(),
                status: "Pending",
            };
            let err;
            try {
                await new Request(requestData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.beneficiary).to.exist;
        });

        it("should throw an error if donor ID is missing", async () => {
            const requestData = {
                post: new mongoose.Types.ObjectId(),
                beneficiary: new mongoose.Types.ObjectId(),
                status: "Rejected",
            };
            let err;
            try {
                await new Request(requestData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.donor).to.exist;
        });

        it("should throw an error if status is invalid", async () => {
            const requestData = {
                post: new mongoose.Types.ObjectId(),
                beneficiary: new mongoose.Types.ObjectId(),
                donor: new mongoose.Types.ObjectId(),
                status: "InvalidStatus", // ❌ Invalid value
            };
            let err;
            try {
                await new Request(requestData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.status).to.exist;
        });

        it("should set default status to 'Pending'", async () => {
            const requestData = {
                post: new mongoose.Types.ObjectId(),
                beneficiary: new mongoose.Types.ObjectId(),
                donor: new mongoose.Types.ObjectId(),
            };
            const request = new Request(requestData);
            const savedRequest = await request.save();

            expect(savedRequest.status).to.equal("Pending"); // Default value check
            expect(savedRequest.createdAt).to.exist;
        });
    });
});
