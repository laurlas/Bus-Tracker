$(document).ready(function () {
    let ws = io.connect(window.location.origin, {query:"loggeduser=client"});
    ws.addEventListener('error', function (event) {
        alert('Server is closed!');
    });
    ws.addEventListener('close', function (event) {
        alert('Connection closed!');
    });
    $(document).on('click', '#submit', function () {
        let request = {
            busNr: $('#bus-nr').val()
        };
        ws.send(JSON.stringify(request));
    });
    let markersArray = [];
    ws.on('message', function (response) {
        console.log(response.data);
        locations = JSON.parse(response.data);
        for (let i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
        for (let loc in locations) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[loc].lat, locations[loc].lng),
                map: map,
                title: $('#bus-nr').val()
            });
            markersArray.push(marker);
        }
    });
    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                ws.send(JSON.stringify(geolocation));
            });
        }
    }
});

