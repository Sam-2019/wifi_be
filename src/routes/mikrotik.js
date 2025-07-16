import express from "express";
import {
  getUsers,
  getUser,
  disableUser,
  enableUser,
  createUser,
  pingMikrotik
} from "../services/mikrotik/index.js";
import { authMiddleware } from "../config/middleware.js";

// API routes for Mikrotik user management
const mikrotikRouter = express.Router();

mikrotikRouter.get("/mikrotik", authMiddleware, async (req, res) => {
  try {
    await pingMikrotik();
    res
      .status(200)
      .json({ message: "ping successful" });
  } catch (error) {
    console.error("ping failed:", error);
    res.status(500).json({ message: error });
  }
});


// Get all users
// Endpoint: GET /api/mikrotik/users
// Returns a list of all users in the Mikrotik hotspot
mikrotikRouter.get("/mikrotik/users", authMiddleware, async (req, res) => {
  try {
    const users = await getUsers();
    res
      .status(200)
      .json({ data: users, message: "Users fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: error || "Failed to fetch users" });
  }
});

// Get a specific user by userName
// Endpoint: GET /api/mikrotik/user
// Returns the user details for the specified userName
mikrotikRouter.get("/mikrotik/user", authMiddleware, async (req, res) => {
  const results = req.body;

  if (!results || !results.userName) {
    return res.status(400).json({ error: "Username is required" });
  }
  const { userName } = results;
  try {
    const user = await getUser(userName);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user, message: "User fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: error || "Failed to fetch user" });
  }
});

// Disable a user
// Endpoint: POST /api/mikrotik/user/disable
// Disables the specified user in the Mikrotik hotspot
mikrotikRouter.post(
  "/mikrotik/user/disable",
  authMiddleware,
  async (req, res) => {
    const results = req.body;

    if (!results || !results.userName) {
      return res.status(400).json({ error: "Username is required" });
    }
    const { userName } = results;

    try {
      await disableUser(userName);
      res
        .status(200)
        .json({ message: "User disabled successfully" });
    } catch (error) {
      res.status(500).json({ error: error || "Failed to disable user" });
    }
  },
);

// Enable a user
// Endpoint: POST /api/mikrotik/user/enable
// Enables the specified user in the Mikrotik hotspot
mikrotikRouter.post(
  "/mikrotik/user/enable",
  authMiddleware,
  async (req, res) => {
    const results = req.body;
    if (!results || !results.userName) {
      return res.status(400).json({ error: "Username is required" });
    }
    const { userName } = results;
    try {
      await enableUser(userName);
      res
        .status(200)
        .json({ message: "User enabled successfully" });
    } catch (error) {
      res.status(500).json({ error: error || "Failed to enable user" });
    }
  },
);

// Add a new user
// Endpoint: POST /api/mikrotik/user/add
// Adds a new user to the Mikrotik hotspot with the provided details
mikrotikRouter.post("/mikrotik/user/add", authMiddleware, async (req, res) => {
  const results = req.body;
  if (!results || !results.userName || !results.password || !results.profile) {
    return res
      .status(400)
      .send({ error: "Name, password and profile are required" });
  }

  try {
    const user = await createUser(results);
    res.status(201).json({ data: user, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: error || "Failed to add user" });
  }
});

export default mikrotikRouter;
