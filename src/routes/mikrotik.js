import express from "express";
import { authMiddleware } from "../config/middleware.js";
import {
  getUsers,
  getUser,
  disableUser,
  enableUser,
  createUser,
} from "../services/mikrotik/index.js";

// API routes for Mikrotik user management
const mikrotikRouter = express.Router();

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
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a specific user by username
// Endpoint: GET /api/mikrotik/user
// Returns the user details for the specified username
mikrotikRouter.get("/mikrotik/user", authMiddleware, async (req, res) => {
  const results = req.body;

  if (!results || !results.username) {
    return res.status(400).json({ error: "Username is required" });
  }
  const { username } = results;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user, message: "User fetched successfully" });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
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

    if (!results || !results.username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const { username } = results;

    try {
      const user = await disableUser(username);
      res
        .status(200)
        .json({ data: user, message: "User disabled successfully" });
    } catch (error) {
      console.error("Error disabling user:", error);
      res.status(500).json({ error: "Failed to disable user" });
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
    if (!results || !results.username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const { username } = results;
    try {
      const user = await enableUser(username);
      res
        .status(200)
        .json({ data: user, message: "User enabled successfully" });
    } catch (error) {
      console.error("Error enabling user:", error);
      res.status(500).json({ error: "Failed to enable user" });
    }
  },
);

// Add a new user
// Endpoint: POST /api/mikrotik/user/add
// Adds a new user to the Mikrotik hotspot with the provided details
mikrotikRouter.post("/mikrotik/user/add", authMiddleware, async (req, res) => {
  const results = req.body;
  if (!results || !results.username || !results.password || !results.profile) {
    return res
      .status(400)
      .send({ error: "Name, password and profile are required" });
  }

  try {
    const user = await createUser(results);
    res.status(201).json({ data: user, message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

export default mikrotikRouter;
