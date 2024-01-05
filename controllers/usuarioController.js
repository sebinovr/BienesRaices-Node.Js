import { check, validationResult } from "express-validator" 
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"
import { generarId, generarJWT } from "../helpers/tokens.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js"

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Login',
        csrfToken: req.csrfToken(),
    })
}

const autenticar = async (req,res)=>{
    //autenticar
    await check('email').isEmail().withMessage('Favor incluir email correcto').run(req)
    await check('password').notEmpty().withMessage('Favor incluir password correcto').run(req)
    let resultado = validationResult(req)

    if( !resultado.isEmpty()){
        //errores
        return res.render('auth/login',{
            pagina: 'Login',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { email, password } = req.body

    //comprobar si usuario existe
    const usuario = await Usuario.findOne( {where: {email }})
    if(!usuario){
        return res.render('auth/login',{
            pagina: 'Login',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
        })
    }

    //confirmar si usuario esta confirmado 
    if (!usuario.confirmado){
        return res.render('auth/login',{
            pagina: 'Login',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}],
        })
    }

    //validar contraseña
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Login',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}],
        })
    }

    //autenticar un usuario 
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})

    //Almacenar token en Cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true,
        //sameSite: true
    }).redirect('/mis-propiedades')
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}


const registrar = async (req, res) => {
    //validacion
    await check('nombre').notEmpty().withMessage('Favor incluir campo nombre').run(req)
    await check('email').isEmail().withMessage('Favor incluir email correcto').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracter').run(req)
    //await check('repetir_password').equals('password').withMessage('Los passwords no son iguales').run(req) ##REVISAR##
    let resultado = validationResult(req)

    //verificar resultado vacio
    if( !resultado.isEmpty()){
        //errores
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            //autorellenar campos
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //extraer valores 
    const { nombre, email, password } = req.body;

    //verificar que usuario no este ya registrado
    const existeUsuario = await Usuario.findOne({ where: {email} })
    if( existeUsuario ){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya posee una cuenta'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })

    }

    //almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //envio email de confirmacion 
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //mostrar mensaje de confirmacion de creacion de cuenta
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada',
        mensaje: 'Hemos enviado un Email de Confirmacion'
    })

}

const confirmar = async (req, res) =>{
    //extraer token
    const { token } = req.params

    //verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error en confirmacion',
            mensaje: 'Hubo un error al confirmar tu cuenta',
            error: true
        })
    }

    //confirmar cuenta
    usuario.token=null
    usuario.confirmado=true
    await usuario.save() //guarda cambios en BD

    return res.render('auth/confirmar-cuenta', {
        pagina: 'Confirmacion correcta',
        mensaje: 'Cuenta confirmada correctamente'
    })

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res)=> {
    //validacion
    await check('email').isEmail().withMessage('Favor incluir email correcto').run(req)
    let resultado = validationResult(req)

    //verificar resultado vacio
    if( !resultado.isEmpty()){
        //errores
        return res.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //buscar usuario
    const {email} = req.body

    const usuario = await Usuario.findOne( {where: {email}} )
    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no esta registrado'}],
        })
    }

    //generar token e enviar email
    usuario.token = generarId()
    await usuario.save()

    //enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //mostrar mensaje
    res.render('templates/mensaje',{
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

const comprobarToken = async (req, res)=>{
    const { token } = req.params
    
    const usuario = await Usuario.findOne( {where: { token }})

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            mensaje: 'Error al validar el usuario',
            error: true
        })
    }

    //mostrar formulario si token es valido
    res.render('auth/reset-password',{
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken(),

    })

}

const nuevoPassword = async (req, res)=>{
    //validar 
    await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracter').run(req)
    let resultado = validationResult(req)


    //verificar resultado vacio
    if( !resultado.isEmpty()){
        //errores
        return res.render('auth/reset-password',{
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }


    const { token } = req.params
    const { password } = req.body

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne( {where: { token }})

    //Hashear usuario
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt)

    usuario.token = null
    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        pagina: 'Confirmacion de Cuenta',
        mensaje: 'Se modificado el Password Correctamente'
    })

}

const cerrarSesion = async (req, res) =>{
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    cerrarSesion 
}