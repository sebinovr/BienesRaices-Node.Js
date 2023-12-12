import { validationResult } from 'express-validator' 
import { Precio, Categoria, Propiedad } from '../models/index.js'

const admin = (req, res) =>{
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra:true
    })
}

const crear = async (req,res)=>{
    //Consultar modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra:true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })

    //crear registro
    const { titulo, descripcion, categoria: categoriaId, precio: precioId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body
    const { id: usuarioId } = req.usuario

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            categoriaId,
            precioId,
            usuarioId,
            imagen: 'imagen'
        })
        
        const { id } = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
    
}

const guardar = async (req, res)=>{
    //validacion 
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        //Consultar modelo de Precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear',{
            pagina: 'Crear propiedad',
            barra:true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            //autocompletar
            datos: req.body
        })
    }
}

export {
    admin,
    crear,
    guardar 
}