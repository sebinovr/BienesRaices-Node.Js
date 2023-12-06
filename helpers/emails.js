import nodemailer from 'nodemailer'

const emailRegistro = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    })

    const {email, nombre, token} = datos

    //enviar email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu correo',
        html: `
            <h2>Hola ${nombre}</h2>
            <p>Gracias por registrarte en nuestra pagina</p>
            <h3>Confirma tu correo</h3>
            <p>Haz click en el siguiente enlace para confirmar tu correo</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a>`
    })

}


const emailOlvidePassword = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    })

    const {email, nombre, token} = datos

    //enviar email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Recupera tu cuenta - Cambiar Password',
        html: `
            <h2>Hola ${nombre}</h2>
            <h3>Reestablece tu contrasena</h3>
            <p>Haz click en el siguiente enlace para generar nuevo password</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Nuevo Password</a>`
    })

}


export {
    emailRegistro,
    emailOlvidePassword
}