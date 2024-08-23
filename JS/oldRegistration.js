
document.addEventListener("DOMContentLoaded", function () {
  var check_doc_status = "http://34.93.164.215:5000/sheRyds/v1/driver/checkDocStatus";
  var sherydr_details = "http://34.93.164.215:5000/sheRyds/v1/driver/details";
  var get_dl = "http://34.93.164.215:5000/sheRyds/v1/driver/get-document/DL";
  var get_rc = "http://34.93.164.215:5000/sheRyds/v1/driver/get-document/RC";
  var get_pan = "http://34.93.164.215:5000/sheRyds/v1/driver/get-document/PAN";
  var get_aadhar = "http://34.93.164.215:5000/sheRyds/v1/driver/get-document/AADHAR";


  var update_profile = "http://34.93.164.215:5000/sheRyds/v1/driver/update-profile"
  var verify_dl_api = "http://34.93.164.215:5000/sheRyds/v1/payout/verifyDL";
  var verify_rc_api = "http://34.93.164.215:5000/sheRyds/v1/payout/verifyRC";
  var verify_pan_api = "http://34.93.164.215:5000/sheRyds/v1/payout/verifyPan";
  var verify_aadhar_api = "http://34.93.164.215:5000/sheRyds/v1/payout/verifyAADHAR";
  var verify_aadhar_otp = 'http://34.93.164.215:5000/sheRyds/v1/payout/verifyAadharOtp';

  var document_upload = "http://34.93.164.215:5000/sheRyds/v1/driver/upload";
  var save_bank_details = 'http://34.93.164.215:5000/sheRyds/v1/payout/saveBankDetails';


  var headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    'key': localStorage.getItem("mobileNumber"),
    app_token: 'bKbumwUX1vs8FLr8'
  };


  var loading = false;

  const CheckingRegistration = () => {
    var dataBody = {
      docTypes: [
        "Profile",
        "DL",
        "RC",
        "PAN",
        "AADHAR",
        // "Training",
        "Payment",
      ],
    };

    fetch(check_doc_status, {
      method: "POST",
      headers,
      body: JSON.stringify(dataBody),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Success:", data.data);
        var mainData = data.data;
        for (let i = 0; i < mainData.length; i++) {
          switch (mainData[i].docType) {
            case "Profile":
              updateStatus("headingOne", mainData[i].status);
              continue;
            case "DL":
              updateStatus(
                "headingTwo",
                mainData[i].status,
                mainData[i].otherRemark && mainData[i].otherRemark.length > 0 ? mainData[i].otherRemark : mainData[i].remark
              );
              continue;
            case "RC":
              updateStatus(
                "headingThree",
                mainData[i].status,
                mainData[i].otherRemark && mainData[i].otherRemark.length > 0 ? mainData[i].otherRemark : mainData[i].remark
              );
              continue;
            case "PAN":
              updateStatus(
                "headingFour",
                mainData[i].status,
                mainData[i].otherRemark && mainData[i].otherRemark.length > 0 ? mainData[i].otherRemark : mainData[i].remark
              );
              continue;
            case "AADHAR":
              updateStatus(
                "headingFive",
                mainData[i].status,
                mainData[i].otherRemark && mainData[i].otherRemark.length > 0 ? mainData[i].otherRemark : mainData[i].remark
              );
              continue;
            case "Payment":
              updateStatus('headingSix', mainData[i].status)
              continue;
          }
        }

        // All Documents Including Payment Section is Verified
        if ((mainData[0].docType === "Profile" && mainData[0].status === "complete") && (mainData[1].docType === "DL" && mainData[1].status === "verified") && (mainData[2].docType === "RC" && mainData[2].status === "verified") && (mainData[3].docType === "PAN" && mainData[3].status === "verified") && (mainData[4].docType === "AADHAR" && mainData[4].status === "verified") && (mainData[5].docType === "Payment" && mainData[5].status === "complete")) {
          console.log('Everything is Verified')
          alert('Your All Documents are verified')
        }

        // Showing Payment Section When All the Documents are Verified
        if ((mainData[0].docType === "Profile" && mainData[0].status === "complete") && (mainData[1].docType === "DL" && mainData[1].status === "verified") && (mainData[2].docType === "RC" && mainData[2].status === "verified") && (mainData[3].docType === "PAN" && mainData[3].status === "verified") && (mainData[4].docType === "AADHAR" && mainData[4].status === "verified")) {
          document.getElementById('bank-part').style.display = 'block';
        }

        function disableAccordionToggle(headingId, message) {
          const accordionButton = document.querySelector(`#${headingId} .accordion-button`);
          accordionButton.classList.add('disabled'); // Add a class to style as disabled

          accordionButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the toggle
            event.stopPropagation(); // Stop the event from bubbling
            alert(message);
          });
        }

        // Check each document status and disable the corresponding accordion if verified/complete
        const docStatus = {
          "headingFour": "PAN",
          "headingTwo": "DL",
          "headingThree": "RC",
          "headingFive": "AADHAR",
          "headingSix": "Payment"
        };

        Object.keys(docStatus).forEach(headingId => {
          const docType = docStatus[headingId];
          const doc = mainData.find(d => d.docType === docType);
          if (doc && (doc.status === "verified" || doc.status === "complete")) {
            disableAccordionToggle(headingId, 'Already Verified');
          }
        });

        // Showing Under Verification Message
        const md = mainData.filter((v) => ['DL', 'RC', 'AADHAR', 'PAN'].includes(v.docType))
        let count = 0;
        for (let m of md) {
          if (m.status === 'under verification') {
            count++;
          }
        }
        if (count > 0) {
          document.getElementById('under_verification_mess').style.display = 'block';
        }
        // if (count === md.length) {
        //   document.getElementById('under_verification_mess').style.display = 'block';
        // }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  // AutoFill Already Submitted Profile Data from API
  const completeProfile = () => {

    document.getElementById('profile-next').innerText = `Update`
    // document.getElementById('profile-next').style.display = 'none'
    // document.getElementById('updateProfile').style.display = 'block'
    fetch(sherydr_details, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('profile ka Data ', data);
          // Log the profile image URL
          console.log('Profile Image URL:', data.data?.ProfileImage);

          // Set the profile image source
          const profileImageElement = document.getElementById('previewprofile');
          profileImageElement.src = data.data.hasOwnProperty('ProfileImage') && data.data.ProfileImage.length > 0 ? data.data.ProfileImage : "Images/profile-user.png";

          console.log('profileImageElement.src:', profileImageElement.src);

          document.getElementById("username").value = data.data.Name;
          document.getElementById("address").value = data.data.Address;
          document.getElementById("blood_group").value = data.data.BloodGroup;
          document.getElementById("city").value = data.data.City;
          document.getElementById("dob").value = data.data.DOB;
          document.getElementById("email").value = data.data.Email;
          const allGenders = document.querySelectorAll('input[name="gender"]');

          for (let i = 0; i < allGenders.length; i++) {
            if (allGenders[i].value === data.data.Gender)
              allGenders[i].checked = true;
          }

          document.getElementById("pincode").value = data.data.PinCode;
          document.getElementById("state").value = data.data.State;
        }

        else {
          console.error("Error updating profile:", data);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        // Handle network error
      });
  };

  // AutoFill Already Submitted DL Data from API
  const DLNUM = '';
  const completeDL = () => {
    console.log('DL Auto Fill');
    fetch(get_dl, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log('DL ka Data ', data);
          document.getElementById("dl_number").value = data.docNumber;

          document.getElementById("DL_photos").style.display = 'block';
          document.getElementById("dl_front_photo").style.display = "none";
          document.getElementById("dl_back_photo").style.display = "none";
          document.getElementById("submit-dl-photo").style.display = "none";
          document.getElementById("driving-license-next").style.display = "none";

          const frontDL = document.getElementById('front_photo_preview');
          if (frontDL) {
            frontDL.style.display = 'block';
            frontDL.src = data.docImages[0].docFront;
          } else {
            console.error("Element 'front_photo_preview' not found.");
          }

          const backDL = document.getElementById('back_photo_preview');
          if (backDL) {
            backDL.style.display = 'block';
            backDL.src = data.docImages[0].docBack;
          } else {
            console.error("Element 'back_photo_preview' not found.");
          }

          document.getElementById('dl_number').disabled = true
          document.getElementById("dl_front_photo").disabled = true
          document.getElementById("dl_back_photo").disabled = true

          document.getElementById("driving-license-update").style.display = "block";
          document.getElementById('change_dl_number').style.display = 'flex'
          // Event listener for update button
          document.getElementById("driving-license-update").addEventListener("click", () => {

            document.getElementById("dl_front_photo").disabled = false;
            document.getElementById("dl_back_photo").disabled = false;
            document.getElementById('front_photo_preview').disabled = false
            document.getElementById('back_photo_preview').disabled = false

            document.getElementById("driving-license-update").style.display = 'none';
            document.getElementById("front_photo_preview").style.display = "block";
            document.getElementById("back_photo_preview").style.display = "block";

            document.getElementById("updateDL").style.display = "block";

            handleImagePreview("dl_front_photo", "front_photo_preview");
            handleImageChange("front_photo_preview", "dl_front_photo");

            handleImagePreview("dl_back_photo", "back_photo_preview");
            handleImageChange("back_photo_preview", "dl_back_photo");
          });

          document.getElementById("updateDL").addEventListener('click', () => {
            console.log('update clicked');

            const front_DL = document.getElementById("front_photo_preview").src;
            const back_DL = document.getElementById("back_photo_preview").src;

            if (!front_DL || !back_DL) {
              alert("Please upload both front and back photos of your driving license.");
              return;
            }

            const formData = new FormData();
            formData.append("docType", "DL");
            formData.append("docNumber", document.getElementById('dl_number').value);
            formData.append("documentFront", document.getElementById("dl_front_photo").files[0]);
            formData.append("documentBack", document.getElementById("dl_back_photo").files[0]);

            fetch(document_upload, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                'key': localStorage.getItem("mobileNumber"),
                app_token: 'bKbumwUX1vs8FLr8'
              },
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log('Data received:', data);
                window.location.reload();
                // Handle response data as needed
              })
              .catch((error) => {
                console.error("DL Photo Upload Network error:", error);
                // Handle network error
              });
          });

        } else {
          console.error("Error updating DL:", data);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        // Handle network error
      });
  };

  // completeDL();

  // Changing DL number Action
  document.getElementById('change_dl_number').addEventListener('click', () => {

    document.getElementById("driving-license-update").style.display = 'none';
    document.getElementById('dl_number').disabled = false
    document.getElementById('dl_number').value = '';
    document.getElementById('change_dl_number').style.display = 'none'
    document.getElementById("edit_dl_number_warning").style.display = "flex";
    document.getElementById("driving-license-next").style.display = "block";

    document.getElementById("dl_front_photo").disabled = false;
    document.getElementById("dl_back_photo").disabled = false;
    document.getElementById('front_photo_preview').disabled = false;
    document.getElementById('back_photo_preview').disabled = false;

    document.getElementById("front_photo_preview").src = "";
    document.getElementById("back_photo_preview").src = "";
    document.getElementById('dl_front_photo').value = '';
    document.getElementById('dl_back_photo').value = '';

    document.getElementById("driving-license-next").innerHTML = `Verify`;
    document.getElementById("updateDL").style.display = 'none';
    document.getElementById("DL_photos").style.display = 'none';
  })
  // Changing DL number Action END


  // AutoFill Already Submitted RC Data from API
  const completeRC = () => {
    document.getElementById('ownership_list').style.display = 'none'; // Because From backend We Didnt Get Ownership
    const frontRC = document.getElementById('rc_front_photo_preview');
    fetch(get_rc, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log('RC Data ', data);
          document.getElementById("vehicle_number").value = data.docNumber;
          document.getElementById("RC_photos").style.display = 'block';
          document.getElementById("rc_front_photo").style.display = "none";
          document.getElementById("vehicle-rc-next").style.display = "none";
          frontRC.style.display = 'block';
          frontRC.src = data.docImages[0].docFront;
          document.getElementById("submit-rc-photo").style.display = "none";
          document.getElementById("rc_Edit").style.display = "block"
          document.getElementById("change_vehicle_number").style.display = "flex"
        }

        document.getElementById("vehicle_number").disabled = true;
        document.getElementById('rc_front_photo_preview').disabled = true;
        document.getElementById("rc_front_photo").disabled = true;

        document.getElementById("rc_Edit").addEventListener('click', () => {
          document.getElementById('change_vehicle_number').style.display = 'flex'
          // document.getElementById("vehicle_number").disabled = false;
          document.getElementById('rc_front_photo_preview').disabled = false;
          document.getElementById("rc_front_photo").disabled = false;

          if (frontRC) {
            // Event listener for image preview click (improved)
            frontRC.addEventListener('click', () => {
              const fileInput = document.getElementById('rc_front_photo');
              // fileInput.click(); // Trigger file selection dialog for user to choose new image

              fileInput.addEventListener('change', (event) => {
                const newFile = event.target.files[0];
                if (newFile) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    frontRC.src = e.target.result; // Update preview image with newly selected one
                  };
                  reader.readAsDataURL(newFile);
                }
              });
            });
          } else {
            console.error("Element 'rc_front_photo_preview' not found.");
          }

          handleImageChange("rc_front_photo_preview", "rc_front_photo");

          document.getElementById("rc_Edit").style.display = 'none';
          document.getElementById("updaterc").style.display = 'block';
        })

        document.getElementById("updaterc").addEventListener('click', () => {
          const new_front_RC = document.getElementById("rc_front_photo").files[0];

          const formData = new FormData();
          formData.append("docType", "RC");
          formData.append("docNumber", document.getElementById('vehicle_number').value);
          formData.append("documentFront", new_front_RC);

          fetch(document_upload, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              'key': localStorage.getItem("mobileNumber"),
              app_token: 'bKbumwUX1vs8FLr8'
            },
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              console.log("RC Photo Updated:", data);
              console.log(data)
              window.location.reload(); // Refresh the page or handle success scenario
            })
            .catch((error) => {
              console.error("RC Photo Updated Network error:", error);
              // Handle network error
            });
        });
      })

  }
  // completeRC();


  // Changing Vehicle number Action
  document.getElementById('change_vehicle_number').addEventListener('click', () => {
    document.getElementById('vehicle_number').disabled = false
    document.getElementById('ownership_list').style.display = 'block';
    document.getElementById('vehicle_number').value = '';

    document.getElementById('rc_front_photo_preview').disabled = false;
    document.getElementById("rc_front_photo").disabled = false;
    document.getElementById('rc_front_photo_preview').src = '';
    document.getElementById("pan_front_photo").value = '';

    document.getElementById('change_vehicle_number').style.display = 'none'
    document.getElementById("edit_vehicle_number_warning").style.display = "flex";
    document.getElementById("vehicle-rc-next").style.display = "block";

    document.getElementById("vehicle-rc-next").innerHTML = `Verify`;
    document.getElementById("updaterc").style.display = 'none'
    // document.getElementById("updateAADHAR").classList.remove('next-btn')
    document.getElementById('RC_photos').style.display = 'none'
    document.getElementById('rc_Edit').style.display = 'none'
  })
  // Changing Vehicle number Action END



  // AutoFill Already Submitted PAN Data from API
  const completePAN = () => {
    const frontPAN = document.getElementById('pan_front_photo_preview');
    fetch(get_pan, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log('PAN Data ', data);
          document.getElementById("pan_number").value = data.docNumber;

          document.getElementById("PAN_photos").style.display = 'block';
          document.getElementById("pan_front_photo").style.display = "none";
          document.getElementById("pan-card-next").style.display = "none";
          frontPAN.style.display = 'block';
          frontPAN.src = data.docImages[0].docFront;
          document.getElementById("submit-pan-photo").style.display = "none";
          document.getElementById("pan_Edit").style.display = "block";
          document.getElementById("change_pan_number").style.display = "flex";

        }

        document.getElementById('pan_number').disabled = true
        document.getElementById('pan_front_photo_preview').disabled = true
        document.getElementById("pan_front_photo").disabled = true

        document.getElementById('pan_Edit').addEventListener('click', () => {
          document.getElementById('pan_Edit').style.display = 'none'
          document.getElementById('change_pan_number').style.display = 'flex'
          document.getElementById('updatepan').style.display = 'block'

          // document.getElementById('pan_number').disabled = false
          document.getElementById('pan_front_photo_preview').disabled = false
          document.getElementById("pan_front_photo").disabled = false



          if (frontPAN) {
            frontPAN.addEventListener('click', () => {
              const fileInput = document.getElementById('pan_front_photo');
              // fileInput.click(); // Trigger file selection dialog for user to choose new image

              fileInput.addEventListener('change', (event) => {
                const newFile = event.target.files[0];
                if (newFile) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    frontPAN.src = e.target.result; // Update preview image with newly selected one
                  };
                  reader.readAsDataURL(newFile);
                }
              });
            });

          }
          else {
            console.error("Element 'pan_front_photo_preview' not found.");
          }

          handleImageChange("pan_front_photo_preview", "pan_front_photo");
        })
        // Event listener for image preview click (improved)



        document.getElementById("updatepan").addEventListener('click', () => {
          const new_front_PAN = document.getElementById("pan_front_photo").files[0];

          console.log('pan Update Clicked')

          const formData = new FormData();
          formData.append("docType", "PAN");
          formData.append("docNumber", document.getElementById("pan_number").value); // Assuming docNumber is the vehicle number
          formData.append("documentFront", new_front_PAN);

          console.log('new pan', document.getElementById("pan_number").value)

          fetch(document_upload, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              'key': localStorage.getItem("mobileNumber"),
              app_token: 'bKbumwUX1vs8FLr8'
            },
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log('fetch hua kya?')
              return response.json();
            })
            .then((data) => {
              console.log("PAN Photo Updated:", data);
              window.location.reload(); // Refresh the page or handle success scenario
            })
            .catch((error) => {
              console.error("PAN Photo Updated Network error:", error);
              // Handle network error
            });
        });
      })
  }
  // completePAN();

  // Changing PAN number Action

  document.getElementById('change_pan_number').addEventListener('click', () => {
    // Enable the PAN number input field
    document.getElementById('pan_number').disabled = false;

    // Clear the PAN number input field
    document.getElementById('pan_number').value = '';

    // Clear the PAN front photo preview
    const frontPAN = document.getElementById('pan_front_photo_preview');
    frontPAN.src = ''; // Reset the source to an empty string

    // Clear the PAN front photo file input
    document.getElementById('pan_front_photo_preview').disabled = false
    document.getElementById("pan_front_photo").disabled = false
    document.getElementById('pan_front_photo').value = '';

    // Hide and reset the display elements
    document.getElementById('change_pan_number').style.display = 'none';
    document.getElementById("edit_pan_number_warning").style.display = "flex";
    document.getElementById("pan-card-next").style.display = "block";
    document.getElementById("pan-card-next").innerHTML = `Verify`;

    document.getElementById("updatepan").style.display = 'none'

    // Hide the photo section and edit button
    document.getElementById("PAN_photos").style.display = 'none';
    document.getElementById("pan_Edit").style.display = "none";
  });

  // Changing PAN number Action END


  // const updateAADHAR = async (frontAADHAR_File, backAADHAR_File) => {
  //   const formData = new FormData();

  //   const frontPhotoInput = document.getElementById("aadhar_front_photo");
  //   const backPhotoInput = document.getElementById("aadhar_back_photo");

  //   console.log('frontPhotoInput.files > ', frontPhotoInput.files)
  //   console.log('backPhotoInput.files > ', backPhotoInput.files)

  //   async function fetchImageToBinary(fileUrl) {
  //     try {
  //       // Step 1: Fetch the image
  //       const response = await fetch(fileUrl, {
  //         mode: 'no-cors',
  //       });
  //       const blob = await response.blob();  // Convert the response to a Blob

  //       console.log('response****', response);
  //       console.log('blob****', blob)
  //       // formData.append('file', blob, 'image.jpg'); // Append the Blob to FormData
  //       return blob;
  //     } catch (error) {
  //       console.error('Error fetching the image:', error);
  //     }
  //   }



  //   const fetchAndAppendImage = async (fileInput, formDataKey) => {

  //     if (fileInput.files[0]) {
  //       formData.append(formDataKey, fileInput.files[0]);
  //     }
  //   };

  //   await fetchAndAppendImage(frontPhotoInput, 'documentFront');
  //   await fetchAndAppendImage(backPhotoInput, 'documentBack');

  //   // Append other form data as needed
  //   formData.append('docNumber', document.getElementById('aadhaar_number').value);
  //   formData.append('docType', "AADHAR");

  //   fetch(document_upload, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       'key': localStorage.getItem("mobileNumber"),
  //       app_token: 'bKbumwUX1vs8FLr8'
  //     },
  //     body: formData,
  //   })
  //     .then(async response => {
  //       const contentType = response.headers.get('content-type');
  //       if (contentType && contentType.includes('application/json')) {
  //         return response.json();
  //       } else {
  //         const text = await response.text();
  //         throw new Error(`Unexpected response format: ${text}`);
  //       }
  //     })
  //     .then(data => {
  //       console.log('udpated aadhar data', data)
  //       if (data) {
  //         console.log("AADHAR updated successfully:", data);
  //         // window.location.reload();
  //       } else {
  //         console.error("Error updating AADHAR:", data);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Network error:", error);
  //     });
  // };


  // AutoFill Already Submitted AADHAR Data from API

  const completeAADHAR = () => {
    console.log('AADHAR Auto Fill');
    fetch(get_aadhar, {
      method: "GET",
      headers,
    })

      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log('AADHAR Data ', data);
          document.getElementById("aadhaar_number").value = data.docNumber;

          document.getElementById("AADHAR_Photos").style.display = 'block';
          document.getElementById("aadhar_front_photo").style.display = "none";
          document.getElementById("aadhar_back_photo").style.display = "none";
          document.getElementById("submit-aadhar-photo").style.display = "none";
          document.getElementById("aadhar-next").style.display = "none";


          const frontAADHAR = document.getElementById('aadhar_front_photo_preview');
          if (frontAADHAR) {
            frontAADHAR.style.display = 'block';
            frontAADHAR.src = data.docImages[0].docFront;
          } else {
            console.error("Element 'aaadhar_front_photo_preview' not found.");
          }

          const backAADHAR = document.getElementById('aadhar_back_photo_preview');
          if (backAADHAR) {
            backAADHAR.style.display = 'block';
            backAADHAR.src = data.docImages[0].docBack;
          } else {
            console.error("Element 'aadhar_back_photo_preview' not found.");
          }


          document.getElementById('aadhaar_number').disabled = true
          document.getElementById("aadhar_front_photo").disabled = true
          document.getElementById("aadhar_back_photo").disabled = true

          document.getElementById("aadhar-edit").style.display = "block";
          document.getElementById("edit_aadhar_number").style.display = "flex";
          // Event listener for update button
          document.getElementById("aadhar-edit").addEventListener("click", () => {

            document.getElementById("aadhar_front_photo").disabled = false
            document.getElementById("aadhar_back_photo").disabled = false
            document.getElementById("aadhar_front_photo_preview").disabled = false
            document.getElementById("aadhar_back_photo_preview").disabled = false

            document.getElementById("aadhar-edit").style.display = 'none';
            document.getElementById("aadhar_front_photo_preview").style.display = "block";
            document.getElementById("aadhar_back_photo_preview").style.display = "block";

            document.getElementById("updateAADHAR").style.display = "block";

            handleImagePreview("aadhar_front_photo", "aadhar_front_photo_preview");
            handleImageChange("aadhar_front_photo_preview", "aadhar_front_photo");

            handleImagePreview("aadhar_back_photo", "aadhar_back_photo_preview");
            handleImageChange("aadhar_back_photo_preview", "aadhar_back_photo");

          });



          document.getElementById("updateAADHAR").addEventListener('click', () => {
            console.log('AADHAR update clicked');
            // updateAADHAR(frontAADHAR_File, backAADHAR_File);

            const formData = new FormData();

            // const frontPhotoInput = document.getElementById("aadhar_front_photo");
            // const backPhotoInput = document.getElementById("aadhar_back_photo");


            formData.append('docType', "AADHAR");
            formData.append('docNumber', document.getElementById('aadhaar_number').value);
            formData.append('documentFront', document.getElementById('aadhar_front_photo').files[0])
            formData.append('documentBack', document.getElementById('aadhar_back_photo').files[0])

            fetch(document_upload, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                'key': localStorage.getItem("mobileNumber"),
                app_token: 'bKbumwUX1vs8FLr8'
              },
              body: formData,
            })
              .then((response) =>
                response.json()).then((data) => {
                  console.log('Addhar Data recevied', data)
                  window.location.reload();
                })
              .catch(error => {
                console.error("Aadhar photo upload Network error", error);
              });
          });

        } else {
          console.error("Error updating AADHAR:", data);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        // Handle network error
      });
  };

  // completeAADHAR();

  // Changing Addhar Number ACtion
  document.getElementById('edit_aadhar_number').addEventListener('click', () => {

    // document.getElementById("updateAADHAR").classList.remove('next-btn')

    document.getElementById('aadhar-edit').style.display = 'none'
    document.getElementById('aadhaar_number').disabled = false
    document.getElementById('aadhaar_number').value = '';
    document.getElementById('edit_aadhar_number').style.display = 'none'
    document.getElementById("edit_aadhar_number_warning").style.display = "flex";
    document.getElementById("aadhar-next").style.display = "block";

    document.getElementById("aadhar_front_photo").disabled = false;
    document.getElementById("aadhar_back_photo").disabled = false;
    document.getElementById('aadhar_front_photo_preview').disabled = false;
    document.getElementById('aadhar_back_photo_preview').disabled = false;

    document.getElementById("aadhar_front_photo_preview").src = "";
    document.getElementById("aadhar_back_photo_preview").src = "";
    document.getElementById('aadhar_front_photo').value = '';
    document.getElementById('aadhar_back_photo').value = '';

    document.getElementById("aadhar-next").innerHTML = `Verify`;
    document.getElementById("updateAADHAR").style.display = 'none'
    document.getElementById("AADHAR_Photos").style.display = 'none'
  })

  // Changing Addhar Number ACtion ENDS------------------






  // *************Reusable Functions For Photo Upload**********

  // Function to handle image preview
  const handleImagePreview = (inputId, previewId) => {
    const inputElement = document.getElementById(inputId);
    const previewElement = document.getElementById(previewId);

    inputElement.addEventListener("change", (e) => {
      const file = inputElement.files[e.currentTarget.files.length - 1];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewElement.src = e.target.result;
          previewElement.style.display = "block";
          previewElement.style.cursor = "pointer";
        };
        inputElement.style.display = "none";
        reader.readAsDataURL(file);
      }
    });
  };

  // Function to handle image change
  const handleImageChange = (previewId, inputId) => {
    const previewElement = document.getElementById(previewId);

    const newElement = document.getElementById(inputId);
    const changeHandler = (e) => {
      const file = e.currentTarget.files[e.currentTarget.files.length - 1];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewElement.src = e.target.result;
          previewElement.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    };

    previewElement.addEventListener("click", () => {
      newElement.style.display = "none"; // Hide the new input element

      // Remove existing event listener before adding a new one
      newElement.removeEventListener("change", changeHandler);
      newElement.addEventListener("change", changeHandler);

      newElement.click();
    });
  };

  // *************Reusable Functions For Photo Upload**********



  // completeProfile();

  // Updating Status and remark Of Accordian Sections


  const updateStatus = async (accordionId, status, remark) => {

    const accordionButton = document.querySelector(
      `#${accordionId} .accordion-button`
    );
    const iconContainer = document.querySelector(
      `#${accordionId} .icon-container`
    );
    if (
      ["headingOne", "headingSix"].includes(accordionId) &&
      status === "complete"
    ) {
      accordionButton.classList.remove("error");
      accordionButton.classList.add("success");
      iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';

      if (accordionId === "headingOne" && status === "complete") {
        completeProfile();
      }
    } else if (status === "verified") {
      accordionButton.classList.remove("error");
      accordionButton.classList.add("success");
      iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
      // if (accordionId === 'headingTwo') {
      //   completeDL();
      // } else if (accordionId === 'headingThree') {
      //   completeRC();
      // }
    } else if (status === "under verification") {
      accordionButton.classList.remove("success");
      accordionButton.classList.add("error");
      iconContainer.innerHTML =
        '<i class="fa-regular fa-hourglass-half" style="color: #f17609;"></i>';

      if (accordionId === 'headingTwo') {
        completeDL();
      } else if (accordionId === 'headingThree') {
        completeRC();
      } else if (accordionId === 'headingFour') {
        completePAN();
      } else if (accordionId === 'headingFive') {
        completeAADHAR();
      }

      // console.log('remark', remark + accordionId)

      if (remark && remark.length > 0) {

        const parentElement = document.getElementById(accordionId); // Get the parent element by id
        if (parentElement) {

          const remarkElement = parentElement.querySelector('.remark'); // Get the child element with class 'remark'
          if (remarkElement) {
            remarkElement.innerText = `*` + remark; // Update the text with the remark
          } else {
            console.log(`Element with class 'remark' not found inside #${accordionId}.`);
          }
        } else {
          console.log(`Element with id ${accordionId} not found.`);
        }
      }
    }
    if (accordionId === "headingOne" && status === "complete") {
      document.getElementById('document-part').style.display = 'block';
    }
  };

  CheckingRegistration();

  // --- Accordion Icon Update Function ---
  function updateAccordionIcon(accordionId, isValid) {
    const accordionButton = document.querySelector(
      `#${accordionId} .accordion-button`
    );
    const iconContainer = document.querySelector(
      `#${accordionId} .icon-container`
    );
    if (isValid) {
      accordionButton.classList.remove("error");
      accordionButton.classList.add("success");
      iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      accordionButton.classList.remove("success");
      accordionButton.classList.add("error");
      iconContainer.innerHTML = '<i class="fas fa-times-circle"></i>';
    }
  }


  // Frist Time Filling Data


  // --- Profile Section Validation ---
  const profileNextButton = document.getElementById("profile-next");
  const profileForm = document.getElementById("profile-form");
  const profileFields = profileForm.querySelectorAll("input:not([type='file']), textarea, select");


  // Function to preview the profile image and set the imageUploaded flag

  var imageUploaded = false;
  function previewprofileImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
      const output = document.getElementById("previewprofile");
      output.src = reader.result;
      imageUploaded = true; // Set the flag when an image is uploaded
    };
    reader.readAsDataURL(event.target.files[0]);
  }


  document.getElementById("profile_image").addEventListener("change", previewprofileImage);
  // Calculate the maximum allowed date (18 years ago from today)


  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  document
    .getElementById("dob")
    .setAttribute("max", maxDate.toISOString().split("T")[0]);

  function validateFields(fields, form) {
    let allFieldsFilled = true;
    let firstEmptyField = null;

    fields.forEach(function (field) {
      if (
        (field.type !== "radio" && field.value.trim() === "")
        // || (field.type === "radio" &&
        //   !form.querySelector('input[name="gender"]:checked'))
      ) {
        console.log('ddd', field)
        allFieldsFilled = false;
        field.classList.add("empty_error");
        if (firstEmptyField !== null) {
          firstEmptyField = field;
        }
      } else {
        field.classList.remove("empty_error");
      }
    });

    // Check if the profile image is selected or if an existing image is available

    const profileImage = document.getElementById("profile_image");
    const existingImage = document.getElementById("previewprofile").src === "Images/profile-user.png";
    console.log('profileImage >', profileImage.files)
    console.log('SRC> ', document.getElementById("previewprofile").src)
    console.log('existing Image >', existingImage)

    if (profileImage.files.length) {
      profileImage.classList.remove("empty_error");
    }
    else if (!existingImage) {
      profileImage.classList.remove("empty_error");
    } else {
      console.log('fdf')
      allFieldsFilled = false;
      profileImage.classList.add("empty_error");
      if (firstEmptyField !== null) {
        firstEmptyField = profileImage;
      }
    }

    console.log('allFieldsFilled', allFieldsFilled)
    console.log('firstEmptyField', firstEmptyField)

    if (!allFieldsFilled && firstEmptyField) {
      alert("Please fill out all fields or Profile Img.");
      firstEmptyField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return allFieldsFilled;
  }

  // --- Profile Next Button Click Event ---

  profileNextButton.addEventListener("click", function () {


    console.log('Profile Next Cliked')
    if (validateFields(profileFields, profileForm)) {

      if (imageUploaded) {

        var formData = new FormData();

        const profileImageFile = document.getElementById("profile_image").files[0];

        if (profileImageFile) {
          formData.append("profileImage", profileImageFile);
        }

        // Get the date value from the input field
        const dateInput = document.getElementById('dob').value;
        console.log('Prev DOB', dateInput)

        // Convert the date to DD-MM-YYYY format
        const date = new Date(dateInput);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // console.log('new', formattedDate)

        formData.append("FirstName", document.getElementById("username").value);
        formData.append("address", document.getElementById("address").value);
        formData.append("bloodGroup", document.getElementById("blood_group").value);
        formData.append("city", document.getElementById("city").value);
        formData.append('dateOfBirth', formattedDate);

        formData.append("email", document.getElementById("email").value);
        formData.append("gender", document.querySelector("input[name='gender']:checked").value);
        formData.append("pincode", document.getElementById("pincode").value);
        formData.append("state", document.getElementById("state").value);

        console.log(formData);

      } else {
        var reqbody = {
          FirstName: document.getElementById("username").value,
          address: document.getElementById("address").value,
          bloodGroup: document.getElementById("blood_group").value,
          city: document.getElementById("city").value,
          dateOfBirth: document.getElementById("dob").value,
          email: document.getElementById("email").value,
          gender: document.querySelector("input[name='gender']:checked").value,
          pincode: document.getElementById("pincode").value,
          state: document.getElementById("state").value,
        }
      }

      console.log('BODY >>', JSON.stringify(reqbody))

      fetch(update_profile, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'key': localStorage.getItem("mobileNumber"),
          app_token: 'bKbumwUX1vs8FLr8'
        },
        body: imageUploaded ? formData : JSON.stringify(reqbody),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Profile updated successfully:", data);
            // window.location.reload();
            profileNextButton.innerHTML = `Update`

          } else {
            console.error("Error updating profile:", data);
          }
        })
        .catch((error) => {
          console.error("Network error:", error);
          // Handle network error
        });
    } else {
      console.log("Nothing not validating fields");
    }
  });



  // --- Driving License Section ---

  document
    .getElementById("driving-license-next")
    .addEventListener("click", function () {
      const dlNumberField = document.getElementById("dl_number");
      const dlNumber = dlNumberField.value.trim();

      if (dlNumber === "") {
        dlNumberField.classList.add("empty_error");
        dlNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAccordionIcon("headingTwo", false); // Error icon
      }
      else {
        dlNumberField.classList.remove("empty_error");

        const DLNumber = dlNumber;
        // DLNUM = dlNumber

        // loading = true
        document.getElementById(
          "driving-license-next"
        ).innerHTML = `<span class="spinner-border text-danger" role="status" />`;
        fetch(verify_dl_api, {
          method: "POST",
          headers,
          body: JSON.stringify({
            licenseNumber: DLNumber,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status !== 400 && data.data.status == "VALID") {
              // console.log('DL Sent successfully:', data);
              console.log("data", data);
              document.getElementById("driving-license-next").innerText =
                "Verify";
              //photo logic
              //Only Work When edit Number Clicked
              document.getElementById("updateDL").disabled = false;
              document.getElementById("updateDL").style.backgroundColor = '#C30000'
              document.getElementById("edit_dl_number_warning").style.display = "none";



              document.getElementById("DL_photos").style.display = 'block';
              document.getElementById('submit-dl-photo').style.display = 'block'
              document.getElementById("driving-license-next").style.display =
                "none";

              /* --------DL Photo Auto Loaded----------- */

              //   fetch(
              //     "http://34.93.164.215:5000/sheRyds/v1/driver/get-document/DL",
              //     {
              //       method: "GET",
              //       headers,
              //     }
              //   )
              //     .then((response) => response.json())
              //     .then((data) => {
              //       if (data.success) {
              //         document.getElementById("");
              //       } else {
              //         console.error("Error photo load:", data);
              //       }
              //     })
              //     .catch((error) => {
              //       console.error("Network error:", error);
              //       // Handle network error
              //     });

              /*---------------DL Auto load End */

              //   document
              //     .getElementById("dl_front_photo")
              //     .addEventListener("change", (event) => {
              //       console.log("event> ", event);
              //     });

              // Call the functions for DL front and back photos
              handleImagePreview("dl_front_photo", "front_photo_preview");
              handleImagePreview("dl_back_photo", "back_photo_preview");
              handleImageChange("front_photo_preview", "dl_front_photo");
              handleImageChange("back_photo_preview", "dl_back_photo");

              // Submit Photo Logic

              document
                .getElementById("submit-dl-photo")
                .addEventListener("click", () => {
                  const front_DL =
                    document.getElementById("dl_front_photo").files[0];
                  const back_DL =
                    document.getElementById("dl_back_photo").files[0];

                  if (!front_DL || !back_DL) {
                    alert(
                      "Please upload both front and back photos of your driving license."
                    );
                    return;
                  }

                  const formData = new FormData();
                  formData.append("docType", "DL");
                  formData.append("docNumber", DLNumber);
                  formData.append("documentFront", front_DL);
                  formData.append("documentBack", back_DL);

                  fetch(document_upload, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                      'key': localStorage.getItem("mobileNumber"),
                      app_token: 'bKbumwUX1vs8FLr8'
                    },
                    body: formData,
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.error(" DL Photo Upload Network error:", error);
                      // Handle network error
                    });
                });

              //   window.location.reload();
            } else {
              console.error("Error updating DL:", data);
              alert(data?.message)
            }
            // loading = false
            document.getElementById("driving-license-next").innerText =
              "Verify";
          })
          .catch((error) => {
            alert('unable to Verify')
            console.log('verify problem', error)
            console.error("Network error:", error);
            // loading = false

            document.getElementById("driving-license-next").innerText =
              "Verify";
          });
      }
    });


    
  // Select the form and the next button
  const form = document.getElementById('vehicle-rc-form');
  const nextButton = document.getElementById('vehicle-rc-next');

  // Function to check if all fields are filled
  function validateForm() {
    let isValid = true;

    // Select all select and input elements inside the form
    const selects = form.querySelectorAll('select');
    const inputs = form.querySelectorAll('input');

    // Check select elements
    selects.forEach(function (select) {
      if (select.value.trim() === '') {
        isValid = false;
        select.classList.add('is-invalid');
      } else {
        select.classList.remove('is-invalid');
      }
    });

    // Check input elements

    if (document.getElementById('vehicle_number').value.trim() === '') {
      isValid = false;
    }
    return isValid;
  }

  // Event listener for the RC next button click
  nextButton.addEventListener('click', function (e) {
    // Prevent form submission
    e.preventDefault();

    // Validate the form
    if (validateForm()) {
      // Display loading spinner or indication
      nextButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;

      // Example fetch request to verify RC
      fetch(verify_rc_api, {
        method: "POST",
        headers,
        body: JSON.stringify({
          vehicleNumber: document.getElementById('vehicle_number').value,
        }),
      })
        .then((response) => {
          // if (!response.ok) {
          //   throw new Error('Network response was not ok');
          // }
          return response.json();
        })
        .then((data) => {
          console.log("Data:", data.message);
          if (data.status == 400) {
            alert(data.message);

          }
          else {

            if (data.data.status === "VALID") {

              nextButton.innerText = "Verify";

              //Only Work When edit Number Clicked
              document.getElementById("updaterc").disabled = false;
              document.getElementById("updaterc").style.backgroundColor = '#C30000'
              document.getElementById("edit_vehicle_number_warning").style.display = "none";

              // Show photo logic
              document.getElementById("RC_photos").style.display = 'block';
              nextButton.style.display = "none";
              document.getElementById('submit-rc-photo').style.display = 'block'


              // Handle image previews and changes for RC photo
              handleImagePreview("rc_front_photo", "rc_front_photo_preview");
              handleImageChange("rc_front_photo_preview", "rc_front_photo");

              // Submit photo logic for RC
              document.getElementById("submit-rc-photo").addEventListener("click", () => {
                const front_RC = document.getElementById("rc_front_photo").files[0];

                if (!front_RC) {
                  alert("Please upload the front photo of your RC.");
                  return;
                }

                const formData = new FormData();
                formData.append("docType", "RC");
                formData.append("docNumber", document.getElementById('vehicle_number').value); // Assuming docNumber is the vehicle number
                formData.append("documentFront", front_RC);

                fetch(document_upload, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    'key': localStorage.getItem("mobileNumber"),
                    app_token: 'bKbumwUX1vs8FLr8'
                  },
                  body: formData,
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log("RC Photo Upload Response:", data);
                    console.log(data)
                    window.location.reload(); // Refresh the page or handle success scenario
                  })
                  .catch((error) => {
                    console.error("RC Photo Upload Network error:", error);
                    // Handle network error
                  });
              });

            } else {
              console.error("Error verifying RC:", data);
              alert(mess)
            }
          }

          // Reset button text after fetch completes
          nextButton.innerText = "Next";
        })
        .catch((error) => {
          console.error("Network error:", error);
          // Reset button text after fetch error
          nextButton.innerText = "Next";
        });

    } else {
      console.log('Please fill in all required fields.');
      // Optionally, provide visual feedback to the user
    }
  });


  // PAN card section
  document
    .getElementById("pan-card-next")
    .addEventListener("click", function () {
      var panNumberField = document.getElementById("pan_number");
      var panNumber = panNumberField.value.trim();

      if (panNumber === "") {
        panNumberField.classList.add("empty_error");
        panNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAccordionIcon("headingFour", false); // Error icon
      } else {
        panNumberField.classList.remove("empty_error");

        const PANnumber = panNumber;
        document.getElementById("pan-card-next").innerHTML = `<span class="spinner-border text-danger" role="status"></span>`;

        fetch(verify_pan_api, {
          method: "POST",
          headers,
          body: JSON.stringify({ pan: PANnumber }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Checking pan Data', data)
            if (data.code == 400) {
              alert(data.message);
              document.getElementById('pan-card-next').innerText = "Next";

            } else {
              if (data.data.valid) {
                console.log("PAN data", data);

                // document.getElementById("pan-card-next").innerText = "Verify";

                document.getElementById("pan-card-next").style.display = "none";

                // Show photo logic
                console.log('Showing img')

                //Only Work When edit Number Clicked
                document.getElementById("updatepan").disabled = false;
                document.getElementById("updatepan").style.backgroundColor = '#C30000'
                document.getElementById("edit_pan_number_warning").style.display = "none";


                document.getElementById('PAN_photos').style.display = 'block'
                document.getElementById("submit-pan-photo").style.display = 'block'
                // Handle image previews and changes for RC photo
                handleImagePreview("pan_front_photo", "pan_front_photo_preview");
                handleImageChange("pan_front_photo_preview", "pan_front_photo");

                // Submit photo logic for RC
                document.getElementById("submit-pan-photo").addEventListener("click", () => {
                  const front_PAN = document.getElementById("pan_front_photo").files[0];


                  if (!front_PAN) {
                    alert("Please upload the front photo of your PAN Card.");
                    return;
                  }

                  const formData = new FormData();
                  formData.append("docType", "PAN");
                  formData.append("docNumber", panNumber);
                  formData.append("documentFront", front_PAN);

                  fetch(document_upload, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                      'key': localStorage.getItem("mobileNumber"),
                      app_token: 'bKbumwUX1vs8FLr8'

                    },
                    body: formData,
                  })
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      return response.json();
                    })
                    .then((data) => {
                      console.log("PAN Photo Upload Response:", data);
                      console.log(data)
                      window.location.reload(); // Refresh the page or handle success scenario
                    })
                    .catch((error) => {
                      console.error("RC Photo Upload Network error:", error);
                      // Handle network error
                    });
                })
              }
              else {
                console.error("Error verifying PAN:", data);
                // Reset button text after fetch completes
                document.getElementById('pan-card-next').innerText = "Next";
              }

            }

          })
          .catch((error) => {
            console.error("Network error:", error);
          });
      }
    });


  // Aadhar Card Section
  document.getElementById("aadhar-next").addEventListener("click", function () {
    var aadharNumberField = document.getElementById("aadhaar_number");
    var aadharNumber = aadharNumberField.value.trim();

    if (aadharNumber === "" || aadharNumber.length !== 12) {
      aadharNumberField.classList.add("empty_error");
      aadharNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
      alert('Aadhar card number must be 12 characters long')
      updateAccordionIcon("headingFive", false); // Error icon
    } else {
      document.getElementById(
        "aadhar-next"
      ).innerHTML = `<span class="spinner-border text-danger" role="status" />`;
      aadharNumberField.classList.remove("empty_error");
      var requestBody = {
        aadharNumber
      };

      fetch(verify_aadhar_api, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error('Unauthorised');
          } else if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('OTP Data', data)
          if (data.data.status === 'SUCCESS') {
            ref_id = data.data.ref_id;
            console.log(ref_id);
            document.getElementById('aadhar_number_section').style.display = 'none';
            document.getElementById('aadhar-next').style.display = 'none';
            document.getElementById('aadhaar_otp').value = ''; // Clear the OTP input field
            document.getElementById('aadhar_otp_section').style.display = 'block';
            document.getElementById("aadhar-otp-verify").innerHTML = `Verify OTP`;
            document.getElementById('aadhar-otp-verify').style.display = 'block';

          } else {
            alert('Error Sending OTP');
            console.error("Error sending Aadhaar OTP:", data);
            document.getElementById('aadhar_btn_div').classList.add("button_centre");
            document.getElementById("aadhar-next").innerHTML = `Next`;
          }
        })
        .catch((error) => {
          if (error.message === 'Unauthorised') {
            console.log("Clearing local storage");
            alert('Session Expired');
            window.location.href = 'login.html';
            localStorage.clear();
          }
          console.error("Error in Aadhaar verification:", error);
          alert('Error sending Aadhaar OTP. Please try again.');
          document.getElementById('aadhar_btn_div').classList.add("button_centre");
          document.getElementById("aadhar-next").innerHTML = `Next`;
        });
    }
  });

  document.getElementById('aadhar-otp-verify').addEventListener('click', () => {
    var aadharOtpInput = document.getElementById('aadhaar_otp');
    var otp = aadharOtpInput.value.trim(); // Get the OTP value and trim any extra spaces

    document.getElementById("aadhar-otp-verify").innerHTML = `<span class="spinner-border text-danger" role="status" />`;

    // Construct the request body for Aadhaar OTP verification
    var otpRequestBody = {
      ref_id,
      otp
    };

    // Fetch API call to verify Aadhaar OTP
    fetch(verify_aadhar_otp, {
      method: 'POST',
      headers,
      body: JSON.stringify(otpRequestBody)
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Unauthorised');
        }
        else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(function (otpData) {
        if (otpData.data) {
          console.log('OTP verification successful:', otpData);
          document.getElementById('addhar_feedback').style.display = 'none';
          document.getElementById("updateAADHAR").disabled = false
          document.getElementById("updateAADHAR").style.backgroundColor = '#C30000'
          document.getElementById("edit_aadhar_number_warning").style.display = "none";

          document.getElementById('aadhar_otp_section').style.display = 'none';
          document.getElementById('aadhar-otp-verify').style.display = 'none';

          document.getElementById('aadhar_number_section').style.display = 'block';
          document.getElementById("AADHAR_Photos").style.display = 'block';
          document.getElementById("submit-aadhar-photo").style.display = 'block';

          // Call the functions for AADHAR front and back photos
          handleImagePreview("aadhar_front_photo", "aadhar_front_photo_preview");
          handleImagePreview("aadhar_back_photo", "aadhar_back_photo_preview");
          handleImageChange("aadhar_front_photo_preview", "aadhar_front_photo");
          handleImageChange("aadhar_back_photo_preview", "aadhar_back_photo");

          // Submit Photo Logic

          document
            .getElementById("submit-aadhar-photo")
            .addEventListener("click", () => {
              const front_AADHAR =
                document.getElementById("aadhar_front_photo").files[0];
              const back_AADHAR =
                document.getElementById("aadhar_back_photo").files[0];

              if (!front_AADHAR || !back_AADHAR) {
                alert(
                  "Please upload both front and back photos of your Aadhar card."
                );
                return;
              }

              const formData = new FormData();
              formData.append("docType", "AADHAR");
              formData.append("docNumber", document.getElementById("aadhaar_number").value);
              formData.append("documentFront", front_AADHAR);
              formData.append("documentBack", back_AADHAR);

              fetch(document_upload, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                  'key': localStorage.getItem("mobileNumber"),
                  app_token: 'bKbumwUX1vs8FLr8'
                },
                body: formData,
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log("AADHAR Photo Upload Response:", data);
                  window.location.reload();
                })
                .catch((error) => {
                  console.error(" AADHAR Photo Upload Network error:", error);
                  // Handle network error
                });
            });

        }
        // else {
        //   console.error('Error verifying OTP:', otpData);
        //   alert('Incorrect OTP. Please try again.');
        //   // Hide OTP section and show Aadhaar number section
        //   document.getElementById('aadhar_otp_section').style.display = 'none';
        //   document.getElementById('aadhar-otp-verify').style.display = 'none';
        //   document.getElementById("aadhar-next").innerHTML = `Next`;
        //   document.getElementById('aadhar_number_section').style.display = 'block';
        //   document.getElementById('aadhar-next').style.display = 'block';
        // }
      })
      .catch(function (otpError) {
        console.log('AAdhar Checking Wrong OTP', otpError)
        if (otpError.message === 'Unauthorised') {
          console.log("Clearing local storage");
          alert('Session Expired')
          window.location.href = 'login.html'
          localStorage.clear()
        }
        else {
          console.error('OTP verification error:', otpError);
          alert('Error verifying OTP. Please try again.');
          // Hide OTP section and show Aadhaar number section
          document.getElementById('aadhar_otp_section').style.display = 'none';
          document.getElementById('aadhar-otp-verify').style.display = 'none';
          document.getElementById("aadhar-next").innerHTML = `Next`;

          document.getElementById('aadhar_btn_div').classList.add("button_centre");
          document.getElementById('addhar_feedback').style.display = 'block';
          document.getElementById('aadhar_number_section').style.display = 'block';
          document.getElementById('aadhar-next').style.display = 'block';
        }
      });
  });


  // AAdhar Section Ends -------------------



  //------------Bank Details Section------------

  const ifscCodeInput = document.getElementById('ifsc-code');
  const ifscCodeFeedback = document.getElementById('ifsc-code-feedback');

  ifscCodeInput.addEventListener('input', async function () {
    const ifscCode = this.value.toUpperCase(); // Ensure uppercase for consistent validation

    const isValidFormat = /^[A-Z]{4}[0-9A-Z]{7}$/.test(ifscCode);

    if (isValidFormat) {
      ifscCodeInput.classList.remove('is-invalid'); // Remove invalid class

      try {
        const response = await fetch(`http://34.93.164.215:5000/sheRyds/v1/payout/${ifscCode}`);
        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const bankName = data.BANK;
        const branch = data.BRANCH

        ifscCodeFeedback.textContent = ''; // Clear any existing feedback message
        document.getElementById('bank_name').style.display = 'block'
        document.getElementById('bank-name').value = bankName || 'Bank not found'; // Autofill or show 'Bank not found'

        document.getElementById('branch_name').style.display = 'block'
        document.getElementById('branch-name').value = branch || 'Branch not found'; // Autofill or show 'Bank not found'

      } catch (error) {
        console.error('Error fetching bank details:', error);
        ifscCodeFeedback.textContent = 'Could not validate IFSC code.';
      }
    } else {
      ifscCodeInput.classList.add('is-invalid'); // Add invalid class for visual feedback
      ifscCodeFeedback.textContent = 'IFSC code should be 4 letters followed by 7 letters or digits.';
      document.getElementById('bank-name').value = ''; // Clear bank name on invalid format
    }
  });

  const bankSubmitBtn = document.getElementById('bank_submit');

  // Add event listener for submit button click
  bankSubmitBtn.addEventListener('click', function () {

    // Check if all fields are filled
    const accHolderName = document.getElementById('acc_holder_name').value.trim();
    const accNumber = document.getElementById('acc-number').value.trim();
    const confirmAccNumber = document.getElementById('confirm-acc-number').value.trim();
    const ifscCode = document.getElementById('ifsc-code').value.trim();
    const bankName = document.getElementById('bank-name').value;

    console.log('accHolderName:', accHolderName);  // Debugging
    console.log('Account Number:', accNumber);  // Debugging
    console.log('Confirm Account Number:', confirmAccNumber);  // Debugging
    console.log('IFSC Code:', ifscCode);  // Debugging
    console.log('Bank Name:', bankName);  // Debugging

    if (accHolderName === '' || accNumber === '' || confirmAccNumber === '' || ifscCode === '') {
      alert('Please fill out all fields');
      return;
    }

    // Check if account numbers match
    if (accNumber !== confirmAccNumber) {
      document.getElementById('acc-number-feedback').textContent = 'Account numbers do not match.';
      return;
    }

    // Clear any previous error messages
    document.getElementById('acc-number-feedback').textContent = '';


    fetch(save_bank_details, {
      method: "POST",
      headers,
      body: JSON.stringify({
        "bankAccount": accNumber,
        "ifsc": ifscCode,
        "accountHolderName": accHolderName,
        "bankName": bankName

      })
    })
      .then(response => response.json())
      .then(data => {

        if (data.status == 400) {
          alert(data.message)
        } else {
          alert('Bank Account Added Succesfully')
          window.location.reload();
        }
        // Handle API response (if needed)

        // Optionally, show success message or redirect
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors
      });
  });

  const upiSubmitButton = document.getElementById('upi_submit');
  const upiIdInput = document.getElementById('upi-id');

  upiSubmitButton.addEventListener('click', () => {
    const upiId = upiIdInput.value.trim();

    if (upiId == '') {
      alert('please fill correct upi id')
    }
    else {

      fetch(save_bank_details, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          "vpa": upiId
        })
      }).then(response => response.json())
        .then(data => {

          alert(data.message)
          // console.log(data.code)
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle errors
        })

    }
  });


  // Submit button click event
  //   document
  //     .getElementById("registration-submit")
  //     .addEventListener("click", function (event) {
  //       event.preventDefault();
  //       var allFieldsFilled = true;
  //       var fieldsToCheck = document.querySelectorAll(
  //         "#profile-form input, #profile-form textarea, #profile-form select, #driving-license-form input, #pan-card-form input, #aadhaar-card-form input"
  //       );

  //       // Track validation status for each section
  //       var sectionsValid = {
  //         headingOne: true,
  //         headingTwo: true,
  //         headingThree: true,
  //         headingFour: true,
  //         headingFive: true,
  //       };

  //       fieldsToCheck.forEach(function (field) {
  //         if (
  //           (field.type !== "radio" && field.value.trim() === "") ||
  //           (field.type === "radio" &&
  //             !document.querySelector('input[name="gender"]:checked'))
  //         ) {
  //           allFieldsFilled = false;
  //           field.classList.add("empty_error");

  //           // Highlight the accordion with a red Color
  //           var accordion = field.closest(".accordion-item");
  //           if (accordion) {
  //             var accordionId = accordion.querySelector(".accordion-header").id;
  //             sectionsValid[accordionId] = false;

  //             var accordionButton = accordion.querySelector(".accordion-button");
  //             if (accordionButton) {
  //               accordionButton.classList.add("error");
  //             }
  //           }
  //         } else {
  //           field.classList.remove("empty_error");
  //           // Remove the red color from the accordion
  //           var accordion = field.closest(".accordion-item");
  //           if (accordion) {
  //             var accordionId = accordion.querySelector(".accordion-header").id;
  //             if (sectionsValid[accordionId] !== false) {
  //               sectionsValid[accordionId] = true;
  //             }

  //             var accordionButton = accordion.querySelector(".accordion-button");
  //             if (accordionButton) {
  //               accordionButton.classList.remove("error");
  //             }
  //           }
  //         }
  //       });

  //       // Update accordion icons based on section validation
  //       for (var section in sectionsValid) {
  //         updateAccordionIcon(section, sectionsValid[section]);
  //       }

  //       if (!allFieldsFilled) {
  //         var firstEmptyField = document.querySelector(".empty_error");
  //         if (firstEmptyField) {
  //           firstEmptyField.scrollIntoView({
  //             behavior: "smooth",
  //             block: "center",
  //           });
  //         }
  //       } else {
  //         // Gathering Data From All Forms
  //         var profileForm = new FormData(document.getElementById("profile-form"));
  //         var drivingLicenseForm = new FormData(
  //           document.getElementById("driving-license-form")
  //         );
  //         var vehicleRcForm = new FormData(
  //           document.getElementById("vehicle-rc-form")
  //         );
  //         var panCardForm = new FormData(
  //           document.getElementById("pan-card-form")
  //         );
  //         var aadhaarCardForm = new FormData(
  //           document.getElementById("aadhaar-card-form")
  //         );

  //         // Combine all data into a single object
  //         var combinedData = {};

  //         profileForm.forEach((value, key) => {
  //           combinedData[key] = value;
  //         });
  //         drivingLicenseForm.forEach((value, key) => {
  //           combinedData[key] = value;
  //         });
  //         vehicleRcForm.forEach((value, key) => {
  //           combinedData[key] = value;
  //         });
  //         panCardForm.forEach((value, key) => {
  //           combinedData[key] = value;
  //         });
  //         aadhaarCardForm.forEach((value, key) => {
  //           combinedData[key] = value;
  //         });

  //         // FormData object for file uploads
  //         var formData = new FormData();
  //         formData.append(
  //           "profile_image",
  //           document.getElementById("profile_image").files[0]
  //         );
  //         formData.append("data", JSON.stringify(combinedData));

  //         fetch("https://httpbin.org/post", {
  //           method: "POST",
  //           body: formData,
  //         })
  //           .then((response) => response.json())
  //           .then((data) => {
  //             console.log("Success:", data);
  //             console.log(data.form.data);
  //             alert("Form submitted successfully!");

  //             // Reset all forms after successful submission
  //             document.getElementById("profile-form").reset();
  //             document.getElementById("driving-license-form").reset();
  //             document.getElementById("vehicle-rc-form").reset();
  //             document.getElementById("pan-card-form").reset();
  //             document.getElementById("aadhaar-card-form").reset();

  //             // Remove all error classes and icons
  //             document
  //               .querySelectorAll(".accordion-button")
  //               .forEach(function (button) {
  //                 button.classList.remove("error", "success");
  //               });

  //             document
  //               .querySelectorAll(".icon-container")
  //               .forEach(function (iconContainer) {
  //                 iconContainer.innerHTML = ""; // Clear the icon HTML
  //               });

  //             // Hide all accordions and show the first one
  //             document.getElementById("collapseOne").classList.remove("show");
  //             document.getElementById("collapseTwo").classList.remove("show");
  //             document.getElementById("collapseThree").classList.remove("show");
  //             document.getElementById("collapseFour").classList.remove("show");
  //             document.getElementById("collapseFive").classList.remove("show");

  //             // Reset accordion icons and heading colors
  //             // updateAccordionIcon('headingOne', false);
  //             // updateAccordionIcon('headingTwo', false);
  //             // updateAccordionIcon('headingThree', false);
  //             // updateAccordionIcon('headingFour', false);
  //             // updateAccordionIcon('headingFive', false);
  //           })
  //           .catch((error) => {
  //             console.error("Error:", error);
  //           });
  //       }
  //     });


});
