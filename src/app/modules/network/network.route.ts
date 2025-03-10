

import express from "express"
import { NetworkController } from "./network.controller"

const router = express.Router()

router.get("/top-returnees",NetworkController.topReturnees)

export const NetworkRoutes = router