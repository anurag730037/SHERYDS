window.addEventListener('DOMContentLoaded', function () {
    var token = localStorage.getItem('accessToken')
    var cityName = localStorage.getItem('cityName')
    var vehicle = localStorage.getItem('vehicleType')
    let htmlPage = ''
    var buttonName = ''

    console.log(typeof cityName)


    if (token && token.length > 0 && cityName && cityName.length > 0 && cityName !== 'undefined' && vehicle && vehicle.length > 0 && vehicle !== 'undefined') {
        // window.location.href = 'oldRegistration.html'
        htmlPage = 'oldRegistration.html'
    }
    else if (token && token.length > 0 && cityName === 'undefined') {
        // window.location.href = 'SelectCities.html'
        htmlPage = 'SelectCities.html'
    }
    else if (token && token.length > 0 && vehicle === 'undefined') {
        // window.location.href = 'SelectVehicle.html'
        htmlPage = 'SelectVehicle.html'
    }
    else if (!token) {
        // window.location.href = 'login.html'
        htmlPage = 'login.html'
    }

    if (token) {
        if (window.matchMedia("(max-width: 981px)").matches) {
            buttonName = `<a href="${htmlPage}" class="d-flex justify-content-center align-items-center">
                                    <div class="log-in profile" style="border-radius: 5px; width: 90%; margin-top:15px">Profile</div>
                                </a>`
        } else {
            buttonName = `<a href="${htmlPage}">
                            <div class="log-in profile" style="border-radius: 50%;"><i class="fa-regular fa-user"></i></div>
                        </a>`
        }
    }
    else {
        if (window.matchMedia("(max-width: 981px)").matches) {
            buttonName = `<a href="${htmlPage}" class="d-flex justify-content-center align-items-center">
                                    <div class="log-in profile" style="border-radius: 5px; width: 90%; margin-top: 15px">Profile</div>
                                </a>`
        }
        else {
            buttonName = `<a href="login.html">
                             <div class="log-in profile" style="border-radius: 50%;"><i class="fa-regular fa-user"></i></div>
                        </a>`
        }
    }
    document.getElementById('loginButton').innerHTML = buttonName


})




