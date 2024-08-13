// JavaScript
var mobileNumber; // Define mobileNumber globally
var send_otp = 'http://34.93.164.215:5000/sheRyds/v1/driver/verify-mobile';
var submit_otp = 'http://34.93.164.215:5000/sheRyds/v1/otp/verify';
var fetch_cities = 'http://34.93.164.215:5000/sheRyds/v1/serviceableCities/city-list';


const GETOTP = () => {
    var mobileNumberInput = document.getElementById('mobilenumber');
    mobileNumber = mobileNumberInput.value.trim(); // Update global mobileNumber

    if (mobileNumber.length !== 10) {
        mobileNumberInput.classList.add('error');
        alert('Mobile Number Should Have 10 Digits')
        return; // Exit function if mobile number is invalid
    }

    mobileNumberInput.classList.remove('error');

    // Construct the payload for the API request
    var requestBody = {
        mobileNumber: mobileNumber,
        memberType: 'rydr'
    };

    // API call to send OTP using Fetch
    fetch(send_otp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            app_token: 'bKbumwUX1vs8FLr8'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('OTP sent successfully:', data);
            // Hide the getotp section and show the submitotp section
            localStorage.setItem('mobileNumber', mobileNumber);
            document.getElementById('getotpSection').style.display = 'none';
            document.getElementById('heading').style.display = 'none';
            document.getElementById('submitotpSection').style.display = 'block';
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            // Handle error, e.g., display error message to the user
            alert('Error sending OTP. Please try again.');
        });
}


// Fetch Cities Was Here
// const fetchCities = () => {
//     fetch(fetch_cities)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             const citySelect = document.getElementById('city');
//             citySelect.innerHTML = ''; // Clear existing options
//             data.data.forEach(city => {
//                 const option = document.createElement('option');
//                 option.value = city;
//                 option.textContent = city;
//                 citySelect.appendChild(option);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching cities:', error);
//             alert('Error fetching cities. Please try again.');
//         });
// }

const SUBMITOTP = () => {
    var otpInput = document.getElementById('otp');
    var otp = otpInput.value.trim(); // Get the OTP value and trim any extra spaces

    // Construct the request body for OTP verification
    var requestBody = {
        mobileNumber: mobileNumber,
        otp: otp,
        deviceModel: "Redmi 6",
        lat: "77.1",
        long: "76.1",
        memberType: "rydr"
    };

    // Fetch API call to verify OTP
    fetch(submit_otp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            app_token: 'bKbumwUX1vs8FLr8',
            'key': localStorage.getItem("mobileNumber")
        },
        body: JSON.stringify(requestBody)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            console.log('OTP verification successful:', data);
            // Store data in local storage
            localStorage.setItem('accessToken', data?.data?.accessToken);
            localStorage.setItem('memberId', data?.data?.user?.memberId);
            localStorage.setItem('memberType', data?.data?.user?.memberType);


            localStorage.setItem('cityName', data?.data?.user?.cityName);
            localStorage.setItem('vehicleType', data?.data?.user?.vehicleType);


            document.getElementById('submitotpSection').style.display = 'none';



            if (data?.data?.user?.cityName && data.data.user.cityName.length > 0 && data?.data?.user?.vehicleType && data.data.user.vehicleType.length > 0) {

                window.location.href = 'oldRegistration.html';
                // document.getElementById('choose_city').style.display = 'none';
                // document.getElementById('choose_vehicle').style.display = 'none';

                // document.getElementById('verifyDocument').style.display = 'block';

            } else if (!data.data.user.cityName) {
                // Fetch cities and show choose city section
                window.location.href = 'SelectCities.html';
                // fetchCities();
                // document.getElementById('choose_city').style.display = 'block';
                // document.getElementById('choose_vehicle').style.display = 'none';
            }
            else if (!data.data.user.vehicleType) {
                // Fetch cities and show choose city section
                window.location.href = 'SelectVehicle.html';

                // document.getElementById('choose_city').style.display = 'none';
                // document.getElementById('choose_vehicle').style.display = 'block';
            }


        })
        .catch(function (error) {
            console.error('Error verifying OTP:', error);
            // Handle error, e.g., display error message to the user
            alert('Error verifying OTP. Please try again.');
        });
}

