import express from "express"
import csrf from 'csurf'
import cookieParser from "cookie-parser"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import propiedadesRoutes from "./routes/propiedadesRoutes.js"
import db from './config/db.js'
import { env } from "process"

//Crear la app
const app = express()

//habilitar lectura de datos de formulario
app.use( express.urlencoded({extended: true}))

//habilitar Cookie Parser
app.use( cookieParser() )

//habilitar CSRF
app.use( csrf( {cookie: true}) )

//conexion a base de datos
try{
    await db.authenticate();
    //crea tabla en DB si no esta creada
    db.sync()
    console.log("Conexión exitosa a BD")
} catch(error){
    console.log('Error al conectarse a la BD: ' + error)
}

//habilitar pug
app.set('view engine','pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public'))

//routing 
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)


//Definir puerto y arrancar el proyecto 
const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`Servidor en puerto ${port}`)
})