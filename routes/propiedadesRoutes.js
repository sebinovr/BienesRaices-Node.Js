import express from "express";
import { body } from 'express-validator'
import { admin, crear, guardar } from "../controllers/propiedadController.js";

const router = express.Router()

router.get('/mis-propiedades', admin)
router.get('/propiedades/crear', crear)

router.post('/propiedades/crear', 
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty()
        .withMessage('La descripcion del Anuncio es Obligatoria')
        .isLength( {max: 250} ).withMessage("La descripcion solo debe ser de 250 caracteres"),
    body('categoria').isNumeric().withMessage("Selecciona una categoria"),
    body('precio').isNumeric().withMessage("Selecciona una rango de precio"),
    body('habitaciones').isNumeric().withMessage("Selecciona numero de habitaciones"),
    body('estacionamiento').isNumeric().withMessage("Selecciona numero de estacionamientos"),
    body('wc').isNumeric().withMessage("Selecciona numero de banos"),
    body('lat').notEmpty().withMessage("Ubica la propiedad en el mapa"),

    guardar
)

export default router 