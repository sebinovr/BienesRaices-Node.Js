import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator' 
import { Precio, Categoria, Propiedad } from '../models/index.js'

const admin =  async (req, res) =>{

    const { id } = req.usuario

    const propiedades = await Propiedad.findAll({
        where: { 
            usuarioId: id
        },
        include: [
            { model: Categoria, as: 'categoria'},
            { model: Precio, as: 'precio'},
        ]
    })

    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        propiedades,
        csrfToken: req.csrfToken()
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
        propiedad,
        csrfToken: req.csrfToken()
    })
}

const almacenarImagen = async (req, res, next) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    try {
        // console.log(req.file)

        // Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }
}

const editar = async (req, res)=>{

    const { id } = req.params

    //validar que propiedad exista
    const propiedad = await Propiedad.findByPk( id )
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //revisar que quien visita la URL, es quien creo la propiedad
    if(req.usuario.id.toString()!== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    //Consultar modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar',{
        pagina: `Editar propiedad ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res) => {
    
    // Verificar validacion 
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        //Consultar modelo de Precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
    
        return res.render('propiedades/editar',{
            pagina: `Editar propiedad`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            //autocompletar
            datos: req.body
        })
    }

    const { id } = req.params

    //validar que propiedad exista
    const propiedad = await Propiedad.findByPk( id )
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //revisar que quien visita la URL, es quien creo la propiedad
    if(req.usuario.id.toString()!== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    //Reescribir y actualizarlo 
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })
        
        await propiedad.save()
        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }

}

const eliminar = async (req, res)=>{
    
    const { id } = req.params

    //validar que propiedad exista
    const propiedad = await Propiedad.findByPk( id )
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //revisar que quien visita la URL, es quien creo la propiedad
    if(req.usuario.id.toString()!== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    //Eliminar imagen
    await unlink(`public/uploads/${propiedad.imagen}`)

    //Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')

}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar
}