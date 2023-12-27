( function(){
    const lat = 45.4883882;
    const lng = -73.6609482;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12.3);

    let markers = new L.FeatureGroup().addTo(mapa)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () =>{
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            const propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)
            
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades =>{
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

    obtenerPropiedades()

})()