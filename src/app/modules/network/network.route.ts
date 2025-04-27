

import express from "express"
import { NetworkController } from "./network.controller"

const router = express.Router()

router.get("/top-returnees",NetworkController.topReturnees)

router.get("/communitys",NetworkController.communitys)
export const NetworkRoutes = router