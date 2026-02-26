import { Router } from "express";
import bcrypt from "bcrypt";
import userModel from "../dao/models/User.js";
import petModel from "../dao/models/Pet.js";
import { faker } from '@faker-js/faker';

const router = Router();

/* ============================
MOCKING USERS (GET)
============================ */

import { generateMockUsers } from "../utils/mockingUsers.js";

router.get("/mockingusers", async (req, res) => {
    try {
        const users = await generateMockUsers(50);

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
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: faker.helpers.arrayElement(["user","admin"]),
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
