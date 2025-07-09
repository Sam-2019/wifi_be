import { connectDB } from "../db";
import { getTodaysRegistrations } from "../db/repository/registration.js";

const setupUser = async () => {
    await connectDB();
    const registeredUsers = await getTodaysRegistrations();
    if (registeredUsers.length > 0) {
        console.log(`Today's registrations: ${registeredUsers.length}`);
        registeredUsers.forEach(user => {
            console.log(`User: ${user.credentials.userName}, Email: ${user.email}`);
            // addUser(user)
            //     .then(response => {
            //         console.log({ response })
            //         console.log(`User ${user.credentials.userName} added successfully.`);
            //     })
            //     .catch(error => {
            //         console.error(`Error adding user ${user.credentials.userName}:`, error);
            //     });
        });
    } else {
        console.log("No registrations found for today.");
    }
};

setupUser();
