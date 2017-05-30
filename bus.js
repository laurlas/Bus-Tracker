$(document).ready(function () {

    $(document).on('click', '#submit', function () {
        let ws = io('ws://localhost:1337', "bus-" + $('#bus-nr').val());
        ws.addEventListener('error', function (event) {
            alert('Server is closed!');
        });
        ws.addEventListener('close', function (event) {
            alert('Connection closed!');
        });
        geolocate();
        setInterval(function () {
            geolocate();
        }, 10000);
        $('.content').addClass('hidden');
        $('.submit-msg').removeClass('hidden');
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

