let cords = JSON.parse(coordinates);
const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: cords, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(cords);
const marker1 = new mapboxgl.Marker({color:"red"})
.setLngLat(cords)
.setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listinglocation}</h4><p>Exact Location will be provided after booking</p>`
        )
    )
.addTo(map);