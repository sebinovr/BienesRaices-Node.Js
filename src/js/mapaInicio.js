( function(){
    const lat = 45.4883882;
    const lng = -73.6609482;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12.3);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    //filtros 
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de Categorias y Precios
    categoriasSelect.addEventListener('change', e =>{
        filtros.categoria = +e.target.value,
        filtrarPropiedades()
    })

    preciosSelect.addEventListener('change', e =>{
        filtros.precio = +e.target.value,
        filtrarPropiedades()
    })


    const obtenerPropiedades = async () =>{
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            // console.log(propiedades)
            mostrarPropiedades(propiedades)
            
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades =>{

        //Limpiar markers previos
        markers.clearLayers()
        
        propiedades.forEach( propiedad => {
            //Agregar pin 
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true,
            })
            .addTo(mapa)
            .bindPopup(`
                <p class='text-indigo-600 font-bold'>${propiedad?.categoria.nombre}</p>
                <h1 class='text-md font-extrabold uppercase my-2'>${propiedad?.titulo}</h1>
                <img src='/uploads/${propiedad.imagen}' alt=${propiedad.titulo}>
                <p class='text-gray-600 font-bold'>${propiedad?.precio.nombre}</p>
                <a href='/propiedad/${propiedad.id}' class='bg-indigo-600 block p-2 text-center font-bold uppercase'>Ver Propiedad</a>
            `)

            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = ( propiedad ) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad 
    }

    const filtrarPrecio = ( propiedad ) => {
        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad 
    }


    obtenerPropiedades()

})()