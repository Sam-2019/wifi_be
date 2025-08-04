import {
  getUsers,
  getUser,
  enableUser,
  createUser,
  disableUser,
  pingMikrotik,
  resetCounter,
} from "../services/mikrotik/index.js";

class Mikrotik {
  ping() {
    async (req, res) => {
      try {
        await pingMikrotik();
        res.status(200).json({ message: "ping successful" });
      } catch (error) {
        console.error("ping failed:", error);
        res.status(500).json({ message: error });
      }
    };
  }

  users() {
    async (req, res) => {
      try {
        const users = await getUsers();
        res
          .status(200)
          .json({ data: users, message: "Users fetched successfully" });
      } catch (error) {
        res.status(500).json({ error: error || "Failed to fetch users" });
      }
    };
  }

  user() {
    async (req, res) => {
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
        res
          .status(200)
          .json({ data: user, message: "User fetched successfully" });
      } catch (error) {
        res.status(500).json({ error: error || "Failed to fetch user" });
      }
    };
  }

  disableUser() {
    async (req, res) => {
      const results = req.body;

      if (!results || !results.userName) {
        return res.status(400).json({ error: "Username is required" });
      }
      const { userName } = results;

      try {
        await disableUser(userName);
        res.status(200).json({ message: "User disabled successfully" });
      } catch (error) {
        res.status(500).json({ error: error || "Failed to disable user" });
      }
    };
  }

  enableUser() {
    async (req, res) => {
      const results = req.body;
      if (!results || !results.userName) {
        return res.status(400).json({ error: "Username is required" });
      }
      const { userName } = results;
      try {
        await enableUser(userName);
        res.status(200).json({ message: "User enabled successfully" });
      } catch (error) {
        res.status(500).json({ error: error || "Failed to enable user" });
      }
    };
  }

  addUser() {
    async (req, res) => {
      const results = req.body;
      if (
        !results ||
        !results.userName ||
        !results.password ||
        !results.profile
      ) {
        return res
          .status(400)
          .send({ error: "Name, password and profile are required" });
      }

      try {
        const user = await createUser(results);
        res
          .status(201)
          .json({ data: user, message: "User added successfully" });
      } catch (error) {
        res.status(500).json({ error: error || "Failed to add user" });
      }
    };
  }

  resetUserCounter() {
    async (req, res) => {
      const results = req.body;
      if (!results || !results.userName) {
        return res.status(400).json({ error: "Username is required" });
      }

      const { userName } = results;
      try {
        await resetCounter(userName);
        res.status(200).json({ message: "Counter reset successful" });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    };
  }
}

export { Mikrotik };
