import express from "express";
import {
  userExists,
  httpStatus,
  emailExists,
  emptyRequest,
  internalServerError,
} from "../config/constants.js";
import {
  addCustomer,
  getCustomer,
  getCustomers,
  checkUsernameAvailability,
} from "../services/db/repository/customer.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";

const router = express.Router();
router.get("/customers", authMiddleware, async (req, res) => {
  try {
    const customers = await getCustomers();
    if (!customers || customers.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No customers found", data: [] });
    }
    res.status(httpStatus.OK).json({ message: customers });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

router
  .route("/customer")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;

    if (
      results === undefined ||
      results === null ||
      results.phoneNumber === undefined ||
      results.phoneNumber === null ||
      results.email === undefined ||
      results.email === null ||
      results.userName === undefined ||
      results.userName === null
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }

    try {
      const customer = await getCustomer(results);
      if (!customer) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "No customer found", data: null });
      }
      res
        .status(httpStatus.OK)
        .json({ message: "Customer found", data: customer });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    const results = req.body;

    if (results === undefined || results === null) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }

    try {
      await addCustomer(results);
      await ntfy({ route: "/customer", payload: results });
      res.status(httpStatus.CREATED).json({ message: "Customer added" });
    } catch (error) {
      if (error.code === 11000) {
        const emailMessage = error?.errmsg?.includes("email")
          ? emailExists
          : null;
        const userNameMessage = error?.errmsg?.includes("credentials.userName")
          ? userExists
          : null;

        const message = {
          email: emailMessage,
          userName: userNameMessage,
        };

        res
          .status(httpStatus.UNPROCESSABLE_ENTITY)
          .json({ message: "Duplicate error", data: message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
      }
    }
  });

router.get("/customer/availabilty", authMiddleware, async (req, res) => {
  const results = req.query;
  if (
    results === undefined ||
    results === null ||
    results.userName === undefined ||
    results.userName === null
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
  }

  try {
    const customer = await checkUsernameAvailability(results);
    if (!customer) {
      return res.status(httpStatus.OK).json({ message: "", data: null });
    }
    res
      .status(httpStatus.CONFLICT)
      .json({ message: "Duplicate error", data: userExists });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

export { router as customerRouter };
