import express from "express"
import { 
    formularioLogin,
    autenticar,
    formularioRegistro, 
    registrar, 
    confirmar, 
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    cerrarSesion
} from "../controllers/usuarioController.js"

//Crear el router
const router = express.Router()

//Routing 
router.get("/login", formularioLogin )
router.post("/login", autenticar)

//cerrar sesion 
router.post('/cerrar-sesion', cerrarSesion )

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)

router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)


export default router