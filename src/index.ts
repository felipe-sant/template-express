import app from "./app"

const port = process.env.PORT ? Number(process.env.PORT) : 3000

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ | Servidor rodando na porta http://0.0.0.0:${port}`)
})