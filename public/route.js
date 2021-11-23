
// Map initialization 
let lat;
let lng;

navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
})

const map = L.map('map').setView([lat, lng], 14);

const userIcon = L.icon({
    iconUrl: '/img/user.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const userMarker = L.marker(
    [lat, lng],
    { icon: userIcon }).addTo(map)


const userPing = [lat, lng]

const busInbound = L.icon({
    iconUrl: '/img/bus.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const busOutbound = L.icon({
    iconUrl: '/img/bus-outbound.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});


const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFydGVjb2RlcyIsImEiOiJja3ZwZG0zeDRlZ3lsMnptbjhiZ3NrbTFtIn0.vXc_RJA_QcE0YbvvDc28tA'
}).addTo(map);

let vehicles = []

let vehiclesPing = []



function showVehicles(routeid) {
    let distanceMessage = document.getElementById('distanceMessage')

    fetch(`/vehicles/${routeid}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.data);

            for (let i = 0; i < vehicles.length; i++) {
                map.removeLayer(vehicles[i])
            }

            vehicles = []

            vehiclesPing = []


            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].attributes.direction_id !== 0) {
                    vehicles.push(L.marker([data.data[i].attributes.latitude, data.data[i].attributes.longitude], { icon: busInbound }))
                    vehiclesPing.push(data.data[i].attributes.latitude, data.data[i].attributes.longitude)
                } else {
                    vehicles.push(L.marker([data.data[i].attributes.latitude, data.data[i].attributes.longitude], { icon: busOutbound }))
                    vehiclesPing.push(data.data[i].attributes.latitude, data.data[i].attributes.longitude)
                }
            }

            for (let i = 0; i < data.data.length; i++) {
                let stopId;
                if (data.data[i].relationships.stop.data === null) {
                    let stopId = data.data[0].relationships.stop.data.id
                } else {
                    stopId = data.data[i].relationships.stop.data.id
                }
                fetch(`https://api-v3.mbta.com/stops/${stopId}`, {
                    headers: {
                        "x-api-key": "6c7e8dcb17e44647ac1b58bdfd77e11a",
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        vehicles[i].bindPopup(`Transpo is on ${data.data.attributes.name}`)
                    })
                    .catch(err => {
                        console.log(`error ${err}`)
                    });
            }

            let featureGroup = L.featureGroup(vehicles).addTo(map)
            // map.fitBounds(featureGroup.getBounds())

            let vehiclesDistance = distance(userPing[0], userPing[1], vehiclesPing[0], vehiclesPing[1], "M")

            userMarker.bindPopup(`Your Transpo is ${vehiclesDistance} miles away`)

        })
}

setInterval(() => {
    showVehicles('<%= routeid %>')
}, 3000);


function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }

    else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return Math.round(dist * 10) / 10
    }
}
