import { faker } from "@faker-js/faker";
import { hubtel, paystack } from "./constants";
import { addRegistration } from "../db/repository/registration";

const registrationFee = 50;
const planPrices = {
  daily: 1,
  weekly: 50,
  monthly: 299,
};

function createRandomRegistration() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const phoneNumber = faker.phone.number();
  const subscriptionPlan = faker.helpers.arrayElement([
    `Daily-(GHC ${planPrices.daily})`,
    `Weekly-(GHC ${planPrices.weekly})`,
    `Monthly-(GHC ${planPrices.monthly})`,
  ]);

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
    blockCourt: faker.helpers.arrayElement([
      "Block-A",
      "Block-B",
      "Block-C",
      "Block-D",
      "Addis Ababa Court",
      "Dar es Salaam Court",
      "Kampala Court",
      "Nairobi Court",
    ]),
    roomType: faker.helpers.arrayElement([
      "1-in-a-room",
      "2-in-a-room",
      "3-in-a-room",
      "4-in-a-room",
    ]),
    roomNumber: faker.helpers.arrayElement(["A20", "B20", "C20", "D20"]),
    isCustodian: false,
    dateTime: Date.now(),
    credentials: JSON.stringify({
      userName: firstName,
      password: lastName,
    }),
    provider: faker.helpers.arrayElement([hubtel.toUpperCase(), paystack.toUpperCase()]),
    registrationType: faker.helpers.arrayElement(["Registration", "Top Up"]),
  };
}

export const seed = async () => {
  const user = createRandomRegistration();
  try {
    const response = await addRegistration(user);
    console.log(response)
  } catch (error) {
    console.error("Error seeding records", error);
  }
};