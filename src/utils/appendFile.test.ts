import { readFileSync, unlinkSync } from "fs"
import { join } from "path"
import { describe, it, expect, afterEach, vi } from "vitest"
import appendFile from "./appendFile"

const filePath = join(__dirname, "appendFile.fixture.tmp")

describe("appendFile", () => {
    afterEach(() => {
        try {
            unlinkSync(filePath)
        } catch {
            // arquivo já removido/nunca criado, nada a fazer
        }
    })

    it("acrescenta o conteúdo informado ao arquivo", async () => {
        await appendFile(filePath, "linha 1\n")
        await appendFile(filePath, "linha 2\n")

        expect(readFileSync(filePath, "utf-8")).toBe("linha 1\nlinha 2\n")
    })

    it("loga o erro e não lança quando a escrita falha", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined)

        await expect(
            appendFile("/caminho/invalido/arquivo.tmp", "conteudo"),
        ).resolves.toBeUndefined()

        expect(consoleSpy).toHaveBeenCalledWith(
            "Erro ao acrescentar conteúdo ao arquivo",
            expect.anything(),
        )
        consoleSpy.mockRestore()
    })
})
