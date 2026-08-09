import { appendFile as appendFileFs } from "fs/promises"

async function appendFile(path: string, content: string): Promise<void> {
    try {
        await appendFileFs(path, content, "utf-8")
    } catch (error) {
        console.error("Erro ao acrescentar conteúdo ao arquivo", error)
    }
}

export default appendFile
