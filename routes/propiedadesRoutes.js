import express from "express";
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad, enviarMensaje, verMensajes, cambiarEstado } from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)

router.post('/propiedades/crear', 
    protegerRuta, 
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

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/propiedades/editar/:id', 
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id',
    protegerRuta,
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
    guardarCambios
)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

//AREA PUBLICA 
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)

//ALMACENAR MENSAJES
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min: 10}).withMessage('Mensaje debe tener minimo de 10 caracteres'),
    enviarMensaje
)

router.get('/mensajes/:id', 
    protegerRuta,
    verMensajes
)

export default router 