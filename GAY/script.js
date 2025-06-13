// Selezioniamo gli elementi del DOM
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.getElementById('sidebar');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const chatList = document.getElementById('chatList');

// Imposta sidebar chiusa su mobile all'avvio
if (window.innerWidth <= 768) {
  sidebar.classList.add('closed');
  document.body.classList.remove('sidebar-open');
} else {
  sidebar.classList.remove('closed');
  document.body.classList.add('sidebar-open');
}

// Toggle per il menu laterale
// Apri sidebar
toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('closed');
  document.body.classList.toggle('sidebar-open');
});

// Chiudi sidebar
closeSidebarBtn.addEventListener('click', () => {
  sidebar.classList.add('closed');
  document.body.classList.remove('sidebar-open');
});

// Funzione per aggiungere un messaggio nel chat window
function addMessage(content, isBot = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(isBot ? 'bot-message' : 'user-message');
  messageDiv.innerText = content;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight; // Scorrimento automatico verso il basso
}

// Funzione per gestire l'invio dei messaggi
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const message = userInput.value.trim();
  
  if (message === "") return;
  
  // Aggiungi il messaggio dell'utente
  addMessage(message);
  userInput.value = '';

  // Simuliamo la risposta del bot (qui integra il tuo sistema `ollama` o API)
  addMessage("I'm thinking...", true); // Placeholder per il bot
  
  // Invia richiesta al bot (qui dovresti fare una chiamata al tuo chatbot)
  const botResponse = await getBotResponse(message); // Funzione che recupera la risposta del bot
  const botMessages = chatWindow.getElementsByClassName('bot-message');
  botMessages[botMessages.length - 1].innerText = botResponse; // Aggiorna il messaggio "Sto pensando..." con la risposta del bot
  // addMessage(botResponse, true); // Aggiungi la risposta finale del bot
});

// Funzione che simula la richiesta al chatbot
async function getBotResponse(userMessage) {
  // Sostituisci questo con la logica per inviare il messaggio al tuo bot in locale, tramite API o comando
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Answer by Giordano AI: "${userMessage}"`);
    }, 1000); // Simula un tempo di risposta di 1 secondo
  });
}

// Funzione per aggiungere chat salvate al menu
function addChatToSidebar(chatName) {
  const chatItem = document.createElement('li');
  chatItem.textContent = chatName;
  chatList.appendChild(chatItem);
}

// Aggiungi un esempio di chat salvata (modifica come necessario)
addChatToSidebar('Chat 1');
addChatToSidebar('Chat 2');
addChatToSidebar('Chat 3');