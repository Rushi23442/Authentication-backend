import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ConnectDB } from './db/db.js'
import cookieParser from "cookie-parser";// very imp step if using cookies


//import all routes

import userRoutes from './routes/user.routes.js'



const app = express()
dotenv.config()
app.use(cors())
const PORT = process.env.PORT||4000
app.use(express.urlencoded({ extended:true }))

app.use(express.json())
app.use(cookieParser())
// app.get('/',(req,res) =>{
//     res.send('hi');
// })

app.use('/api/v1/users',userRoutes)
ConnectDB()
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})