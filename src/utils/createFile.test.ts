import { readFileSync, unlinkSync } from "fs"
import { join } from "path"
import { describe, it, expect, afterEach, vi } from "vitest"
import createFile from "./createFile"

const filePath = join(__dirname, "createFile.fixture.tmp")

describe("createFile", () => {
    afterEach(() => {
        try {
            unlinkSync(filePath)
        } catch {
            // arquivo já removido/nunca criado, nada a fazer
        }
    })

    it("cria o arquivo com o conteúdo informado", async () => {
        await createFile(filePath, "conteudo criado")

        expect(readFileSync(filePath, "utf-8")).toBe("conteudo criado")
    })

    it("loga o erro e não lança quando a escrita falha", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined)

        await expect(
            createFile("/caminho/invalido/arquivo.tmp", "conteudo"),
        ).resolves.toBeUndefined()

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao criar arquivo", expect.anything())
        consoleSpy.mockRestore()
    })
})
