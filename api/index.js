import express from 'express'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'

const app=express()

//发送json数据
app.use(express.json())
//使用cookie
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",usersRoutes)
app.use("/api/posts",postsRoutes)

app.listen(8000,()=>{
    console.log("后台服务端已启动");
})
