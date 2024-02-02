function submitDonorForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age').value;
    const bloodGroup = document.getElementById('bloodGroup').value;
    const address = document.getElementById('address').value;
    const district = document.getElementById('district').value;
    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;
    const pincode = document.getElementById('pincode').value;

    // Password validation conditions
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    // Check if all conditions are met
    if (!(hasUpperCase && hasLowerCase && hasSpecialChar && hasNumber)) {
        document.getElementById('message').innerText = "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number.";
        return; // Exit the function if password conditions are not met
    }

    if (age < 18) {
        document.getElementById('message').innerText = "We appreciate your responsibility, in this young age, come back soon after your 18 years to contribute to society.";
    } else {
        // Process registration logic here
        fetch('/user/donor', { // Corrected URL to match your server route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                password: password,
                age: age,
                bloodGroup: bloodGroup,
                address: address,
                district: district,
                state: state,
                country: country,
                pincode: pincode
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(`Registration successful!\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nAge: ${data.age}`);
            // Redirect back to the main page
            window.location.href = '/';
        })
        .catch((error) => {
            console.error('Fetch Error:', error);
        });
    }
}
