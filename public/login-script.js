function submitLoginForm(event) {
    event.preventDefault();

    const email = document.getElementById('contact').value;
    const password = document.getElementById('password').value;

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response data:', data);

        if (data.message === "Login successful!") {
            console.log('Redirecting to /profile');
            sessionStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/profile';
        } else {
            alert("Incorrect email or password. Please try again.");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
