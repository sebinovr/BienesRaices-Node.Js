import { exit } from 'node:process'
import categorias from './categorias.js'
import Categoria from '../models/Categoria.js'
import precios from './precios.js'
import Precio from '../models/Precio.js'
import db from '../config/db.js'

const importarDatos = async () =>{
    try {
        //Autenticar 
        await db.authenticate()
        
        //Generar columnas
        await db.sync()

        //Insertar datos en DB - CORRE 1ERO CATEGORIA Y LUEGO PRECIO
        // await Categoria.bulkCreate(categorias)
        // await Precio.bulkCreate(precios)

        //CORRE DATOS EN SIMULANEO
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])

        console.log('Datos bien importado')
        exit(0) //finaliza ejecucion sin errores

    } catch (error) {
        console.log(error)
        exit(1) //finaliza ejecucion con errores
    }
}

const eliminarDatos = async ()=>{
    try {
        await Promise.all([
            Categoria.destroy( {where: {}, truncate: true} ),
            Precio.destroy( {where: {}, truncate: true} )
        ])
        console.log('Datos eliminados')
        exit(0) //finaliza ejecucion sin errores

    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2]=== "-i"){
    importarDatos();
}

if(process.argv[2]=== "-e"){
    eliminarDatos();
}