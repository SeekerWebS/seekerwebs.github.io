// Handle registration and login
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    alert('Cadastro realizado com sucesso! Faça o login.');
    document.getElementById('register-container').style.display = 'none';
    document.get
