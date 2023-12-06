import jwt from 'jsonwebtoken'


const generarId = () => {
    return Math.random().toString(32).substring(2) + Date.now().toString(32) 
}

const generarJWT = (datos) => {
    return jwt.sign({id: datos.id, nombre: datos.nombre}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export {
    generarId,
    generarJWT
}