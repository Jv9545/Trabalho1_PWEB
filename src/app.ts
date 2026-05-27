import express, {Request, Response } from "express"

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

function helloWord(req: Request, res: Response): void{
    res.status(200).send('Hello Word!!!')
} 

app.get('/api/hello', helloWord)

app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`))