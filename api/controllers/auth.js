import { db } from '../db.js'
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

export const register = (req, res) => {
    const { username, password, email } = req.body

    //check existing user
    const isExistUserSql = "SELECT * FROM USERS where username=? and email =? ";
    db.query(isExistUserSql, [username, email], (err, data) => {
        if (err) return res.send(err)
        //如果返回的结果长度大于0,返回错误提示
        if (data.length) return res.status(409).json("USER already exists!")

        //Hash a password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(String(password), salt);

        const insertSql = "Insert into users(`username`,`password`,`email`) values(?,?,?)"

        db.query(insertSql, [username, hashPassword, email], (err, data) => {
            if (err) return res.send(err)
            return res.status(200).json("User has been Created!")
        })

    });

}


export const login = (req, res) => {
    const existUser = "SELECT * from users where username=?"

    db.query(existUser, [req.body.username], (err, data) => {
        if (err) return res.json(err)

        if (data.length === 0) return res.status(400).json("User not found!")

        //Check Password
        const isPassWordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        //error will be return if password not correct
        if (!isPassWordCorrect) return res.status(400).json("Wrong username and password")

        //return token
        const privateKey = "jwtTokenKey"

        const token = jwt.sign({ id: data[0].id }, privateKey);

        //返回的时候，不要把密码带回去了
        const { password, ...others } = data[0]
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(others)
    })

}

export const logout = (req, res) => {
    res.send("This is logout")
}