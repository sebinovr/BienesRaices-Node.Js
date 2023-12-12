import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) =>{
    
    //verificar si hay token
    const { _token } = req.cookies
    if(!_token){
        return res.redirect('/auth/login')
    }

    //comprobar el token 
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        //Almacenar usuario al Req
        if(usuario){
            req.usuario = usuario
        } else{
            res.redirect('/auth/login')
        }

        return next()

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

}

export default protegerRuta