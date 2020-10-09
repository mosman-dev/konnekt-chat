const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

const socket = io();

// Getting username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

// Join chat
socket.emit('joinRoom', { username, room });

// Get room and users

socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// Message from Server
socket.on('message', (msg) => {
	outputMessage(msg);

	// Scroll Down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submitting Message
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// Get message text
	const msg = e.target.elements.msg.value;

	// Emit message to server
	socket.emit('chatMessage', msg);

	// Clear input & focus
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// Output message to DOM

const outputMessage = (msg) => {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `
        <p class="meta">${msg.username} <span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>
    `;
	document.querySelector('.chat-messages').appendChild(div);
};

// Add room name to DOM
const outputRoomName = (room) => {
	roomName.innerText = '#' + room;
};

// Add users to DOM
const outputUsers = (users) => {
	userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
};
