async function searchUsers() {
  const bloodType = document.getElementById("bloodType").value;
  const district = document.getElementById("district").value;
  const state = document.getElementById("state").value;

  const response = await fetch("/user/search", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ bloodGroup: bloodType, district, state }),
  });

  const result = await response.json();
  displaySearchResults(result.results);
}

function displaySearchResults(results) {
  const searchResultsDiv = document.getElementById("searchResults");
  searchResultsDiv.innerHTML = "";

  if (results.length === 0) {
    searchResultsDiv.innerHTML = "No matching donors found.";
    return;
  }

  results.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.innerHTML = `
        <p>Name: ${user.name}</p>
        <p>Phone: ${user.phone}</p>
        <p>Email: ${user.email}</p>
        <p>Blood Type: ${user.bloodGroup}</p>
        <p>Address: ${user.address}</p>
        <p>District: ${user.district}</p>
        <p>State: ${user.state}</p>
        <p>Country: ${user.country}</p>
        <p>Pincode: ${user.pincode}</p>
        <div class="action-buttons">
          <button class="request-button" onclick="requestDonor('${user.name}', '${user.phone}')">Request</button>
          <button class="call-button" onclick="callDonor('${user.phone}')">Call</button>
        </div>
        <hr>
      `;
    searchResultsDiv.appendChild(userDiv);
  });
}

function callDonor(phoneNumber) {
  // Check if the device is a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Use the tel URL scheme to initiate a phone call
    window.location.href = `tel:${phoneNumber}`;
  } else {
    // Display a notification to use a mobile phone for calling
    alert("Please use a mobile phone to call the donor number: " + phoneNumber);
  }
}

async function requestDonor(name, phone) {
  console.log("Request initiated for donor:", name);
  const recipientName = prompt("Enter your name:");
  const recipientMobile = prompt("Enter your mobile number:");
  const hospital = prompt("Enter the hospital name:");

  const confirmRequest = confirm(`Confirm blood request to ${name} at ${phone} for ${recipientName} at ${hospital}?`);

  if (confirmRequest) {
      const response = await fetch("/user/request", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ donorName: name, donorPhone: phone, recipientName, recipientMobile, hospital }),
      });

      const result = await response.json();
      if (result.success) {
          alert("Blood request sent successfully!");
      } else {
          alert("Failed to send blood request. Please try again later.");
      }
  }
}



