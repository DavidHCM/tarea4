const userInput = sessionStorage.getItem('userInput');

if (userInput) {
    const socket = io('https://tarea4-c2wm.onrender.com');
    const room = window.location.href.split('/').pop();

    socket.emit('joinRoom', { room, user: userInput });

    const msginput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');

    function appendMessage(user, message, isCurrentUser, timestamp, type = '') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (type === 'connected') {
            messageElement.classList.add('user-connected');
        } else if (type === 'disconnected') {
            messageElement.classList.add('user-disconnected');
        } else {
            messageElement.classList.add(isCurrentUser ? 'sent' : 'received');
        }

        const dateElement = document.createElement('span');
        const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : '';
        dateElement.textContent = formattedDate;
        dateElement.style.fontSize = '12px';
        dateElement.style.color = '#ccc';
        dateElement.style.display = 'block';
        dateElement.style.marginTop = '5px';

        messageElement.textContent = `${user}: ${message}`;
        messageElement.appendChild(dateElement);

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    document.getElementById('send-button').addEventListener('click', () => {
        const message = msginput.value;
        let timestamp = new Date().getTime();

        socket.emit('sendMessage', {
            user: userInput,
            message: message,
            room: room,
            timestamp: timestamp
        });

        appendMessage(userInput, message, true, timestamp);
        msginput.value = '';
    });

    socket.on('getMessage', (data) => {
        appendMessage(data.user, data.message, data.user === userInput, data.timestamp);
    });

    socket.on('userConnected', (message) => {
        appendMessage(`Chat ${room}`, message, false, null, 'connected');
    });

    socket.on('userDisconnected', (message) => {
        appendMessage(`Chat ${room}`, message, false, null, 'disconnected');
    });
} else {
    alert('No se ha ingresado un nombre de usuario');
    location.href = '/';
}
