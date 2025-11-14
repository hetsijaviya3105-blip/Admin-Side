document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('loginForm');
    if(!form){ return; }

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if(!email || !password || password.length < 6){
            form.classList.add('was-validated');
            return;
        }
        if(AdminAuth.login(email, password)){
            window.location.replace('dashboard.html');
        } else {
            alert('Invalid credentials. Try admin@example.com / admin123');
        }
    });
});


