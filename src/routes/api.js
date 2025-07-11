import express from "express";
import { saleRouter } from "./sale.js";
import { paymentRouter } from "./payment.js";
import { customerRouter } from "./customer.js";
import { registrationRouter } from "./registration.js";
import { failedRegistrationRouter } from "./failedRegistation.js";
import { pendingRegistrationRouter } from "./pendingRegistration.js";

const apiRouter = express.Router();
apiRouter.use(saleRouter);
apiRouter.use(customerRouter);
apiRouter.use(paymentRouter);
apiRouter.use(registrationRouter);
apiRouter.use(failedRegistrationRouter);
apiRouter.use(pendingRegistrationRouter);

export default apiRouter;
