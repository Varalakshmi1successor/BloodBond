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
        <hr>
      `;
      searchResultsDiv.appendChild(userDiv);
  });
}
