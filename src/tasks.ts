//src/tasks

import {saveCarsToDB} from "@services/carService"
import cron from "node-cron"

export const startCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("[tasks]: Fetching cars")
        await saveCarsToDB();
    })
}