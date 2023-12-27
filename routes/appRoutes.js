import express from 'express'
import { inicio, categoria, noEncontrado, buscador } from '../controllers/appController.js'

const router = express.Router()

//Pagina Inicio
router.get('/', inicio)

//Categorias
router.get('/', categoria)


//Pagina 404
router.get('/', noEncontrado)

//Buscador
router.post('/', buscador)

export default router