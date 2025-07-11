import serverless from "serverless-http";
import app from "./app";

const isLocal = !process.env.VERCEL;

if (isLocal) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server rodando em http://localhost:${port}`);
    });
}

export const handler = serverless(app);