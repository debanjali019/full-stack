const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const hbs = require("hbs");
const path = require("path");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

const views_path = path.join(__dirname, "../templates/views");

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

require("./db.js");
const register = require("./models/register");

app.set("view engine", "hbs");
app.set("views", views_path);


app.post("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, regno, email, phone, event } = req.body;

    try {
        await register.findByIdAndUpdate(id, {
            name,
            regno,
            email,
            phone,
            event
        });
        res.redirect("/display"); // Redirect back to display page after update
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).send("Update failed.");
    }
});

// ROUTES

app.listen(port, () => {
    console.log(`Running in Port: ${port}`);
});

// Home route
app.get("/index", (req, res) => {
    res.render("index");
});

// Handle form submission
app.post("/send", async (req, res) => {
    try {
        const { name, regno, email, phone, event } = req.body;

        console.log("Received:", { name, regno, email, phone, event });

        const save_data = new register({ name, regno, email, phone, event });

        await save_data.save();
        console.log("Data saved to DB!");

        res.send("Registration successful!");
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).send("An error occurred while saving data.");
    }
});
// MongoDB connection
mongoose.connect("mongodb://localhost:27017/registrations", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Route: Display all registered participants
app.get("/display", async (req, res) => {
    try {
        const data = await register.find();
        res.render("display", { data });
    } catch (err) {
        console.error("Error retrieving participants:", err);
        res.status(500).send("Failed to retrieve participants.");
    }
});

app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    console.log("Trying to delete ID:", id); // Add this!

    try {
        await register.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        console.error("Deletion error:", error); // Add this too!
        res.status(500).send("Error deleting user.");
    }
});
app.get("/", (req, res) => {
    res.send("Homepage working! You can now redirect here after delete.");
});


app.use((req, res, next) => {
    res.status(404).send(`Route ${req.method} ${req.originalUrl} not found.`);
});

