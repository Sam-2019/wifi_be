import Customer from "../modelsXschema/customer.js";
import { excludeItems } from "../../config/constants.js";

const getCustomers = async () => {
    return await Customer.find({}, excludeItems).lean();
};

const addCustomer = async (data) => {
    return await Customer.create(data);
};

const getCustomer = async (data) => {
    const email = data?.email;
    const userName = data?.userName;
    const phoneNumber = data?.phoneNumber;

    return await Customer.findOne(
        {
            "credentials.userName": userName,
            phoneNumber: phoneNumber,
            email: email,
        },
        excludeItems
    ).lean();
};

export { getCustomers, addCustomer, getCustomer };