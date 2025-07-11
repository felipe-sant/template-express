import fs from "fs"
import path from "path"
import { swaggerSpec } from "../config/swagger.config"

const outputPath = path.resolve(__dirname, "../../public/swagger.json")

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2))

console.log("✅ Swagger JSON gerado em:", outputPath)
