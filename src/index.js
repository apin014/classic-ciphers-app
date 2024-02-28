import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { createRequire } from "module"
import { fileURLToPath } from "url"
import { appRouter } from "./server/routes/router.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({path: __dirname + "/./../.env"})
const app = express()
const port = process.env.EXP_PORT || 5000

app.use(express.json())
app.use([appRouter])
app.use(cors)

app.listen(port, () => {
  console.log(`[server]: Server is running at Port:${port}`)
})