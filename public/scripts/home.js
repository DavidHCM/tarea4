let userInput;

document.addEventListener('DOMContentLoaded', () => {
    userInput = prompt('Ingresa el nombre de usuario');
    if (!userInput) {
        alert('No se ha ingresado un nombre de usuario, recarga la pagina e intenta de nuevo');
    } else {
        sessionStorage.setItem('userInput', userInput);
    }
});

window.changeLocation = function(page) {
    window.location.href = `/chat/${page}`;
};