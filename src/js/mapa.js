(function() {

    const lat = 45.4883882;
    const lng = -73.6609482;
    const mapa = L.map('mapa').setView([lat, lng ], 12.3);
    let marker

    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //pin 
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    //detectar movimiento de pin y obtener coordernadas 
    marker.on("moveend", function(e){
        marker = e.target
        const posicion = marker.getLatLng()

        //autocentrar mapa
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        //obtener info de calles al soltar al pin 
        geocodeService.reverse().latlng(posicion, 13).run( function(error, resultado){
            //globo con info en el mapa 
            marker.bindPopup(resultado.address.LongLabel)
            //Llenar campos a medida que se selecciona pin
            document.querySelector(".calle").textContent=resultado?.address?.Address ?? '';
            document.querySelector("#calle").value=resultado?.address?.Address ?? '';
            document.querySelector("#lat").value=resultado?.latlng?.lat ?? '';
            document.querySelector("#lng").value=resultado?.latlng?.lng ?? '';

        })
    })
})()