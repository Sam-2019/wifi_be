import { MikroClient } from "mikro-client";

// This module provides functions to interact with a Mikrotik router using the MikroClient library.
const mikrotikOptions = {
  host: "XXX.XXX.XXX.XXX",
  port: "XXXX",
  username: "xxxxx",
  password: "xxxxx",
  // timeout: 5000,
};

// Create a new instance of MikroClient with the provided options
const mikro = new MikroClient(mikrotikOptions);

// This function creates a new user on the Mikrotik router
const createUser = (username, password) => {
  try {
    return mikro.talk([
      "/user/add",
      `=name=${username}`,
      `=password=${password}`,
      "=group=full",
    ]);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// This function deletes a user by username from the Mikrotik router
const deleteUser = (username) => {
  try {
    return mikro.talk(["/user/remove", `=.id=${username}`]);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// This function retrieves a user by username from the Mikrotik router
const getUser = (username) => {
  try {
    return mikro.talk(["/user/print", `?name=${username}`]);
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// This function retrieves all users from the Mikrotik router
const getUsers = () => {
  try {
    return mikro.talk(["/user/print"]);
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// This function updates a user's password on the Mikrotik router
const updateUser = (username, password) => {
  try {
    return mikro.talk([
      "/user/set",
      `=.id=${username}`,
      `=password=${password}`,
    ]);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export {
  mikrotikOptions,
  mikro,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
};
