import { faker } from "@faker-js/faker";
import { hubtel, paystack } from "./constants.js";
import { addCustomer } from "../services/db/repository/customer.js";
import { addRegistration } from "../services/db/repository/registration.js";

const registrationFee = 50;
const planPrices = {
  daily: 1,
  weekly: 50,
  monthly: 299,
};
const roomNumber = ["A20", "B20", "C20", "D20"];
const roomType = ["1-in-a-room", "2-in-a-room", "3-in-a-room", "4-in-a-room"];
const courtBlock = [
  "Block-A",
  "Block-B",
  "Block-C",
  "Block-D",
  "Addis Ababa Court",
  "Dar es Salaam Court",
  "Kampala Court",
  "Nairobi Court",
];
const registrationType = ["Registration", "Top Up"];
const packages = [
  `Daily-(GHC ${planPrices.daily})`,
  `Weekly-(GHC ${planPrices.weekly})`,
  `Monthly-(GHC ${planPrices.monthly})`,
];

const provider = [hubtel.toUpperCase(), paystack.toUpperCase()];

function createRandomRegistration() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const phoneNumber = faker.string.numeric({
    length: 10,
    allowLeadingZeros: true,
  });
  const fourDigits = faker.string.numeric({
    length: 4,
    allowLeadingZeros: false,
  });
  const subscriptionPlan = faker.helpers.arrayElement(packages);

  const planFee = subscriptionPlan.includes("Daily")
    ? planPrices.daily
    : subscriptionPlan.includes("Weekly")
      ? planPrices.weekly
      : subscriptionPlan.includes("Monthly")
        ? planPrices.monthly
        : 0;

  const totalCost = planFee + registrationFee;

  return {
    regID: faker.string.uuid(),
    fullName: `${firstName} ${lastName}`,
    phoneNumber: String(phoneNumber),
    subscriptionPlan: subscriptionPlan,
    planFee: planFee,
    registrationFee: registrationFee,
    totalCost: totalCost,
    email: email,
    dateOfBirth: faker.date.birthdate(),
    blockCourt: faker.helpers.arrayElement(courtBlock),
    roomType: faker.helpers.arrayElement(roomType),
    roomNumber: faker.helpers.arrayElement(roomNumber),
    isCustodian: false,
    dateTime: Date.now(),
    credentials: {
      userName: String(`${firstName.toLocaleLowerCase() + fourDigits}`),
      password: lastName,
    },
    provider: faker.helpers.arrayElement(provider),
    registrationType: faker.helpers.arrayElement(registrationType),
  };
}

function createCustomer() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const phoneNumber = faker.string.numeric({
    length: 10,
    allowLeadingZeros: true,
  });
  const fourDigits = faker.string.numeric({
    length: 4,
    allowLeadingZeros: false,
  });

  return {
    regID: faker.string.uuid(),
    fullName: `${firstName} ${lastName}`,
    phoneNumber: String(phoneNumber),
    email: email,
    dateOfBirth: faker.date.birthdate(),
    blockCourt: faker.helpers.arrayElement(courtBlock),
    roomType: faker.helpers.arrayElement(roomType),
    roomNumber: faker.helpers.arrayElement(roomNumber),
    isCustodian: false,
    dateTime: Date.now(),
    credentials: {
      userName: String(`${firstName.toLocaleLowerCase() + fourDigits}`),
      password: lastName,
    },
  };
}

export const seed = async () => {
  const user = createRandomRegistration();
  const customer = createCustomer();
  try {
    const registrationRecord = await addRegistration(user);
    const customerRecord = await addCustomer(customer);
    console.log({ registrationRecord });
    console.log({ customerRecord });
  } catch (error) {
    console.error("Error seeding records", error);
  }
};
