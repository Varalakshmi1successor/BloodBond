function submitLoginForm(event) {
    event.preventDefault();

    const email = document.getElementById('contact').value;
    const password = document.getElementById('password').value;

    // Make the fetch request
    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data as needed
        if (data.message === "Login successful!") {
            // Successful login
            alert("Login successful!");
            // Redirect to another page or perform other actions as needed
            window.location.href = '/main';
        } else {
            // Failed login
            alert("Incorrect email or password. Please try again.");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
