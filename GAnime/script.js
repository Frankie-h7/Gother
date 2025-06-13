// Applica effetto pop-up su tutti i pulsanti e link cliccabili
document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mousedown', () => {
      el.classList.add('clicked');
    });
  
    el.addEventListener('mouseup', () => {
      setTimeout(() => el.classList.remove('clicked'), 150);
    });
  
    el.addEventListener('touchstart', () => {
      el.classList.add('clicked');
    });
  
    el.addEventListener('touchend', () => {
      setTimeout(() => el.classList.remove('clicked'), 150);
    });
  });
  
  // Navigazione fluida tra le sezioni
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      const targetID = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetID);
  
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
// Video modal handling
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('animeModalVideo');
const modalSource = modalVideo.querySelector('source');
const closeModal = document.getElementById('closeModal');

document.querySelectorAll('.anime-card').forEach(card => {
  card.addEventListener('click', () => {
    const videoSrc = card.getAttribute('data-src');
    modalSource.src = videoSrc;
    modalVideo.load();
    videoModal.style.display = 'flex';
    modalVideo.play();
  });
});

// Chiudi modale
closeModal.addEventListener('click', () => {
  videoModal.style.display = 'none';
  modalVideo.pause();
  modalVideo.currentTime = 0;
});

// Chiudi modale cliccando fuori dal player
window.addEventListener('click', e => {
  if (e.target === videoModal) {
    videoModal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }
});