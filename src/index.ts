import app from "./app"

const port = 3001

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ | Servidor rodando na porta http://0.0.0.0:${port}`)
})