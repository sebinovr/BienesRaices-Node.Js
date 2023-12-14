import { validationResult } from 'express-validator' 
import { Precio, Categoria, Propiedad } from '../models/index.js'

const admin = (req, res) =>{
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades'
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
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
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
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            //autocompletar
            datos: req.body
        })
    }

    //crear registro
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body
    const { id:usuarioId } = req.usuario
    
    console.log(req.body)
    console.log(req.usuario)
    
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
            imagen:''
        })
            
        const { id } = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)
    
    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req,res)=>{

    const { id } = req.params

    //Validar que propiedad exista 
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        res.redirect('/mis-propiedades')
    }

    //Validar que propiedad NO este publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //Validar que propiedad pertenece a quien esta en la pagina
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: 'Agregar Imagenes',
        csrfToken: req.csrfToken(),
        datos: {}
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen
}