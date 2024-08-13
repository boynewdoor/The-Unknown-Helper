document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('message');
    const clearMessagesBtn = document.getElementById('clearMessagesBtn');
    
    // Generate unique usernames
    let usernameSet = new Set();
    const generateUniqueUsername = () => {
        let username;
        do {
            username = `User${Math.floor(Math.random() * 10000)}`;
        } while (usernameSet.has(username));
        usernameSet.add(username);
        return username;
    };
    
    // Load messages from local storage
    const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messagesContainer.innerHTML = '';
        messages.forEach((message, index) => {
            displayMessage(message, index);
        });
    };
    
    // Display a message
    const displayMessage = (message, index) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        messageElement.innerHTML = `
            <div class="message-actions">
                ${message.userName === currentUserName ? '<button class="delete-btn" data-index="${index}">Delete</button>' : ''}
                <button class="reply-btn" data-index="${index}">Reply</button>
            </div>
            <p class="username">${message.userName}</p>
            <p class="content">${message.text}</p>
            <div class="reply-container">
                ${message.replies ? message.replies.map(reply => `
                    <div class="reply">
                        <p class="username">${reply.userName}</p>
                        <p class="content">${reply.text}</p>
                    </div>
                `).join('') : ''}
                <form class="reply-form" data-index="${index}" style="display: none;">
                    <label for="reply-${index}">Reply:</label>
                    <textarea id="reply-${index}" rows="3" placeholder="Type your reply here..."></textarea>
                    <button type="submit">Submit Reply</button>
                </form>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);

        // Add event listeners to the buttons
        const deleteBtn = messageElement.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                deleteMessage(e.target.dataset.index);
            });
        }

        const replyBtn = messageElement.querySelector('.reply-btn');
        replyBtn.addEventListener('click', (e) => {
            toggleReplyForm(e.target.dataset.index);
        });

        const replyForm = messageElement.querySelector('.reply-form');
        if (replyForm) {
            replyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addReply(e.target.dataset.index, replyForm.querySelector('textarea').value);
            });
        }
    };

    // Toggle reply form visibility
    const toggleReplyForm = (index) => {
        const replyForm = document.querySelector(`.reply-form[data-index="${index}"]`);
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
    };

    // Add a reply to a message
    const addReply = (index, replyText) => {
        if (!replyText.trim()) return; // Prevent adding empty replies
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages[index].replies = messages[index].replies || [];
        messages[index].replies.push({ text: replyText, userName: generateUniqueUsername() });
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
    };

    // Delete a message
    const deleteMessage = (index) => {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages = messages.filter((_, i) => i != index);
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
    };

    // Clear all messages
    const clearMessages = () => {
        localStorage.removeItem('messages');
        loadMessages();
    };

    // Handle form submission
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = messageInput.value;
        if (messageText) {
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            messages.push({ text: messageText, userName: generateUniqueUsername(), replies: [] });
            localStorage.setItem('messages', JSON.stringify(messages));
            messageInput.value = '';
            loadMessages();
        }
    });

    // Initialize the current user name
    const currentUserName = generateUniqueUsername();
    usernameSet.add(currentUserName);

    // Load existing messages
    loadMessages();

    // Add event listener for the clear messages button
    clearMessagesBtn.addEventListener('click', clearMessages);
});
