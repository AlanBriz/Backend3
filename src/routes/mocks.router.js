import { Router } from "express";
import bcrypt from "bcrypt";
import userModel from "../dao/models/User.js";
import petModel from "../dao/models/Pet.js";

const router = Router();

/* ============================
MOCKING USERS (GET)
============================ */

router.get("/mockingusers", async (req, res) => {
    try {
        const users = [];

        for (let i = 0; i < 50; i++) {
            const hashedPassword = await bcrypt.hash("coder123", 10);

            users.push({
                _id: new userModel()._id, // simulate Mongo _id
                first_name: `User${i}`,
                last_name: `Test${i}`,
                email: `user${i}@mock.com`,
                password: hashedPassword,
                role: Math.random() > 0.5 ? "admin" : "user",
                pets: []
            });
        }

        res.status(200).json({
            status: "success",
            payload: users
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* ============================
GENERATE & INSERT DATA (POST)
============================ */

router.post("/generateData", async (req, res) => {
    try {
        const { users, pets } = req.body;

        if (!users || !pets) {
            return res.status(400).json({
                status: "error",
                message: "You must send users and pets as numbers"
            });
        }

        const createdUsers = [];
        const createdPets = [];

        // Generate Users
        for (let i = 0; i < users; i++) {
            const hashedPassword = await bcrypt.hash("coder123", 10);

            const newUser = await userModel.create({
                first_name: `Generated${i}`,
                last_name: `User${i}`,
                email: `generated${i}@mail.com`,
                password: hashedPassword,
                role: Math.random() > 0.5 ? "admin" : "user",
                pets: []
            });

            createdUsers.push(newUser);
        }

        // Generate Pets
        for (let i = 0; i < pets; i++) {
            const newPet = await petModel.create({
                name: `Pet${i}`,
                specie: "dog",
                birthDate: new Date(),
                adopted: false
            });

            createdPets.push(newPet);
        }

        res.status(201).json({
            status: "success",
            message: "Data generated successfully",
            usersCreated: createdUsers.length,
            petsCreated: createdPets.length
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
