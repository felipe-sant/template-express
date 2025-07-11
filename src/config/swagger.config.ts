import swaggerJsdoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentação da API",
      version: "1.0.0",
      description: "API construída com Express e Swagger",
    },
  },
  apis: ["./src/routes/*.ts"],
})

const swaggerDarkThemeCss = `
  .swagger-ui .topbar {
    display: none
  }
`

export { swaggerDarkThemeCss }
export default swaggerSpec