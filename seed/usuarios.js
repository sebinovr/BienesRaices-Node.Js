import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Pau',
        email: 'paula@correo.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10)
    }
]

export default usuarios