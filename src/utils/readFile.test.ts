import { writeFileSync, unlinkSync } from "fs"
import { join } from "path"
import { describe, it, expect, afterEach } from "vitest"
import readFile from "./readFile"

const filePath = join(__dirname, "readFile.fixture.tmp")

describe("readFile", () => {
    afterEach(() => {
        try {
            unlinkSync(filePath)
        } catch {
            // arquivo já removido/nunca criado, nada a fazer
        }
    })

    it("retorna o conteúdo do arquivo quando ele existe", () => {
        writeFileSync(filePath, "conteudo de teste", "utf-8")

        expect(readFile(filePath)).toBe("conteudo de teste")
    })

    it("retorna string vazia quando o arquivo não existe", () => {
        expect(readFile(join(__dirname, "arquivo-inexistente.tmp"))).toBe("")
    })
})
