function openChatBot() {
    document.body.classList.add('show-chatbot');
}

function closeChatBot() {
    document.body.classList.remove('show-chatbot');
}


const chatInput = document.querySelector('#text-input'),
    sendChatBtn = document.querySelector('#send-btn'),
    chatbox = document.querySelector('.chatbox'),
    API_KEY = "sk-proj-WCW4d4MMLJwjQ8wxXfgiT3BlbkFJd8XDgSiFkdC5DIVT5KZM";

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions",
        messageElement = incomingChatLi.querySelector('p'),
        requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            }
            )
        };

    fetch(API_URL, requestOptions).
        then(res => res.json()).
        then(data => {
            if (data.error && data.error.message) {
                throw new Error(data.error.message);
            }
            messageElement.textContent = data.choices[0].message.content;
        }).catch((error) => {
            console.error('Error fetching the API:', error);
            messageElement.classList.add("error")
            messageElement.textContent = "Oops! Couldn't get Sigma answer. Please try again.";
        })
}

const scrollToBottom = () => {
    chatbox.scrollTop = chatbox.scrollHeight;
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    console.log('User message:', userMessage);  // Debugging log
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = '';  // Clear the input after sending the message

    setTimeout(() => {
        const incomingChatLi = createChatLi("Waiting for Sigma answer...", "incoming")
        chatbox.appendChild(incomingChatLi);
        scrollToBottom();
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener('click', handleChat);

