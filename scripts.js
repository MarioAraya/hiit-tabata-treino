// Variables globales para almacenar los reproductores de YouTube
let player1, player2;
let video1Id = 'XZl8PfoP9ag'; // ID del primer video de YouTube
let video2Id = '760TqMz-TwI'; // ID del segundo video de YouTube 

let timers = {
    timer1: { duration: 750, remaining: 750, intervalId: null, isPlaying: false }, // 12m 30s
    timer2: { duration: 270, remaining: 270, intervalId: null, isPlaying: false }, // 4m 30s
};
let onYouTubeEvents = {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
};
let onYouTubeVars = {
    'autoplay': 1, // Iniciar video automáticamente
    'mute': 0, // No Iniciar en mute - puede fallar en algunos navegadores
    'controls': 0, // Sin controles visibles
    'rel': 0, // Evitar recomendaciones
    'showinfo': 0 // Evitar mostrar información del video
}

// Esta función es llamada automáticamente cuando la API de YouTube está lista
function onYouTubeIframeAPIReady() {
    // Cargar los videos de YouTube en los contenedores
    player1 = new YT.Player('youtube1', {
        videoId: video1Id, // ID del video de YouTube
        events: onYouTubeEvents,
        playerVars: onYouTubeVars
    });

    player2 = new YT.Player('youtube2', {
        videoId: video2Id, // ID del video de YouTube
        events: onYouTubeEvents,
        playerVars: onYouTubeVars
    });
}

// Cuando el jugador está listo, lo configuramos para que no inicie hasta que sea necesario
function onPlayerReady(event) {
    event.target.pauseVideo();
}

// Control de los cambios de estado del video
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log('Video Reproduciéndose');
    }
    if (event.data === YT.PlayerState.PAUSED) {
        console.log('Video Pausado');
    }
}

// Función para iniciar o pausar el temporizador y la música
function startStopTimer(timerKey, player) {
    const timer = timers[timerKey];

    if (timer.isPlaying) {
        clearInterval(timer.intervalId);
        player.pauseVideo();  // Pausar el video de YouTube
        timer.isPlaying = false;
    } else {
        timer.intervalId = setInterval(() => updateTimer(timerKey), 1000);
        player.playVideo();  // Reproducir el video de YouTube
        timer.isPlaying = true;
    }
}

// Función para actualizar el temporizador
function updateTimer(timerKey) {
    const timer = timers[timerKey];
    timer.remaining--;

    const minutes = Math.floor(timer.remaining / 60);
    const seconds = timer.remaining % 60;
    const display = document.getElementById(`${timerKey}-display`);

    if (timer.remaining <= 0) {
        clearInterval(timer.intervalId);
        timer.remaining = timerKey === 'timer1' ? 270 : 750; // Reset timer duration for each
        display.innerText = formatTime(timer.remaining);
        timer.isPlaying = false;
    } else {
        display.innerText = "🕒" + formatTime(timer.remaining);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Función para cambiar entre pestañas
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll(".tabcontent");
    tabContents.forEach(tab => tab.style.display = "none");

    const tabLinks = document.querySelectorAll(".tablink");
    tabLinks.forEach(link => link.classList.remove("active"));

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

document.getElementById("timer1").addEventListener('click', () => startStopTimer('timer1', player1));
document.getElementById("timer2").addEventListener('click', () => startStopTimer('timer2', player2));

// Establecer la pestaña activa por defecto
document.querySelector(".tablink").click();