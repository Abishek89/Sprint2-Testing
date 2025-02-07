import { expect } from "chai";
import mongoose from "mongoose";
import Contact from "../models/contact.js";


describe("Contact Model Functions", () => {

    // ✅ Connect to a Test Database Before Running Tests
    before(async function () {
        await mongoose.connect("mongodb://127.0.0.1:27017/contact_test_db", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // ✅ Clear the database before each test
    beforeEach(async function () {
        await Contact.deleteMany({});
    });

    // ✅ Close the database connection after tests
    after(async function () {
        await mongoose.connection.close();
    });

    // Test cases for Contact Model Schema
    describe("Contact Schema Validation", () => {

        it("should successfully save a valid contact", async () => {
            const contactData = {
                name: "John Doe",
                email: "johndoe@example.com",
                message: "Hello, this is a test message.",
            };
            const contact = new Contact(contactData);
            const savedContact = await contact.save();

            expect(savedContact._id).to.exist;
            expect(savedContact.name).to.equal(contactData.name);
            expect(savedContact.email).to.equal(contactData.email);
            expect(savedContact.message).to.equal(contactData.message);
            expect(savedContact.createdAt).to.exist;
        });

        it("should throw an error if name is missing", async () => {
            const contactData = {
                email: "johndoe@example.com",
                message: "Hello, this is a test message.",
            };
            let err;
            try {
                await new Contact(contactData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.name).to.exist;
        });

        it("should throw an error if email is missing", async () => {
            const contactData = {
                name: "John Doe",
                message: "Hello, this is a test message.",
            };
            let err;
            try {
                await new Contact(contactData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.email).to.exist;
        });

        it("should throw an error if message is missing", async () => {
            const contactData = {
                name: "John Doe",
                email: "johndoe@example.com",
            };
            let err;
            try {
                await new Contact(contactData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.message).to.exist;
        });

        it("should throw an error if email format is invalid", async () => {
            const contactData = {
                name: "John Doe",
                email: "invalid-email",
                message: "Hello, this is a test message.",
            };
            let err;
            try {
                await new Contact(contactData).save();
            } catch (error) {
                err = error;
            }
            expect(err).to.exist;
            expect(err.errors.email).to.exist;
        });

        it("should save contact with only required fields", async () => {
            const contactData = {
                name: "Alice Doe",
                email: "alice@example.com",
                message: "Hello there!",
            };
            const contact = new Contact(contactData);
            const savedContact = await contact.save();

            expect(savedContact._id).to.exist;
            expect(savedContact.name).to.equal(contactData.name);
            expect(savedContact.email).to.equal(contactData.email);
            expect(savedContact.message).to.equal(contactData.message);
        });

        it("should set createdAt automatically", async () => {
            const contactData = {
                name: "Bob Smith",
                email: "bobsmith@example.com",
                message: "Testing automatic date",
            };
            const contact = new Contact(contactData);
            const savedContact = await contact.save();

            expect(savedContact.createdAt).to.be.a("date");
        });
    });
});
