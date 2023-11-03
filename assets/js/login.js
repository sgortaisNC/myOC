import {api} from './fonctions.js';

const form = document.querySelector('#loginForm');
form.addEventListener('submit', async function(e){
    e.preventDefault();
    const response = await api(
        'http://localhost:5678/api/users/login',
        'POST',
        JSON.stringify({
            email: form.email.value,
            password: form.password.value
        })
    );
    if (response.message){
        document.querySelector('#contact p').textContent = "Erreur dans le mot de passe ou l'identifiant";
    }else{
        localStorage.setItem('token', response.token);
        window.location.href = 'index.html';
    }
});