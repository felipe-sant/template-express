import app from "./app"

const port = process.env.PORT ? Number(process.env.PORT) : 3000

process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught Exception:", error)
    process.exit(1)
})

process.on("unhandledRejection", (reason: unknown) => {
    console.error("Unhandled Rejection:", reason)
    process.exit(1)
})

app.listen(port, "0.0.0.0", () => {
    console.log(`✅ | Servidor rodando na porta http://0.0.0.0:${port}`)
})
