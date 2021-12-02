function weatherApi(){
    fetch('/latlng')
        .then(res => res.json())
        .then(latlng => {
            fetch(`http://api.weatherapi.com/v1/current.json?key=19645e2074124ba1b17144809211810&q=${latlng.local.coords.lat},${latlng.local.coords.lng}&aqi=no`)
            .then(res => res.json())
            .then(data => {
                let icon = document.getElementById("weatherIcon")
                let text = document.getElementById("weatherText")
                let location = document.getElementById("weatherLocation")
                let temp = document.getElementById("weatherTemp")
                
                icon.src = data.current.condition.icon
                text.textContent = data.current.condition.text
                location.textContent = `${data.location.name}, ${data.location.region}`
            temp.textContent = `${Math.ceil(data.current.temp_f)}\u2109`
            
        })
        .catch(err => console.log(err))
    })
}

weatherApi()

