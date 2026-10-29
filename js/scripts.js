const demos = [
    {
        id: 'demo-animation',
        title: 'Animation Demo',
        category: 'Animation • Video Games • Dubbing',
        url: 'demos/miguel-panergo-animation-demo.mp3'
    }
    // ,
    // {
    //     id: 'demo-animation',
    //     title: 'Animation Demo',
    //     url: '.demos/Miguel Panergo Commercial Demo.mp3'
    // },
    // {
    //     id: 'demo-animation',
    //     title: 'Animation Demo',
    //     url: '.demos/Miguel Panergo Video Game Demo.mp3'
    // },
    // {
    //     id: 'studio-sample',
    //     title: 'Home Studio Sample',
    //     url: '.demos/Miguel Panergo Home Studio Sample.mp3'
    // },
];
const playlistContainer = document.getElementById('audio-playlist');
let currentAudioElement = null;
let currentContainer = null;

const formatTime = (time) => {
    if(isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

demos.forEach((demo) => {
    const playerHTML = `
                <div id="container-${demo.id}" class="audio-player">
                    
                    <button id="btn-${demo.id}" class="play_pause_btn" aria-label="Play ${demo.title}">
                        <i class="fa-solid fa-play ml-1" id="icon-${demo.id}"></i>
                    </button>
                    
                    <div class="audio-info">
                        <div class="audio-title">
                            <div>
                                <div class="audio-title">
                                    <h3 class="label-sm">${demo.title}</h3>
                                    <!-- Audio-Reactive Equalizer Bars -->
                                    <div id="eq-${demo.id}" class="eq
                                    // eq-bars opacity-0 transition-opacity duration-300
                                    " aria-hidden="true">
                                        <span></span><span></span><span></span><span></span>
                                    </div>
                                </div>
                                <p class="sub-label">${demo.category}</p>
                            </div>
                            <div class="time-display" id="time-${demo.id}">
                                0:00 / 0:00
                            </div>
                        </div>
                        
                        <div class="progress-details">
                            <input type="range" class= "progress-bar" id="seek-${demo.id}" value="0" min="0" step="1" class="w-full" aria-label="Seek audio">
                        </div>
                    </div>
                    
                    <!-- Desktop-Only Volume & Download Controls (Hidden on Mobile via hidden md:flex) -->
                    <div class="other-controls">
                        <div class="volume-container">
                            <button id="mute-btn-${demo.id}" class=volume-btn" title="Mute/Unmute">
                                <i class="fas" id="vol-icon-${demo.id}"></i>
                            </button>
                            <div class=" volume-slider-container
                            //w-0 opacity-0 overflow-hidden group-hover:w-20 group-hover:opacity-100 group-hover:ml-2 group-focus-within:w-20 group-focus-within:opacity-100 group-focus-within:ml-2 transition-all duration-300 ease-out flex items-center
                            ">
                                <input type="range" id="vol-${demo.id}" value="1" min="0" max="1" step="0.01" class="volume-slider" aria-label="Volume">
                            </div>
                        </div>
                        
                        <a href="${demo.url}" download class="download-btn" title="Download MP3 (Desktop Only)">
                            <i class="fas">&#xf56d;</i>
                            <span>MP3</span>
                        </a>
                    </div>
                    
                    <audio id="audio-${demo.id}" src="${demo.url}" preload="metadata"></audio>
                </div>
            `;


    playlistContainer.insertAdjacentHTML('beforeend', playerHTML);
    });

demos.forEach(demo => {
            const audio = document.getElementById(`audio-${demo.id}`);
            const playBtn = document.getElementById(`btn-${demo.id}`);
            const playIcon = document.getElementById(`icon-${demo.id}`);
            const seekBar = document.getElementById(`seek-${demo.id}`);
            const timeDisplay = document.getElementById(`time-${demo.id}`);
            const container = document.getElementById(`container-${demo.id}`);
            const eqIndicator = document.getElementById(`eq-${demo.id}`);
            const volBar = document.getElementById(`vol-${demo.id}`);
            const volIcon = document.getElementById(`vol-icon-${demo.id}`);
            const muteBtn = document.getElementById(`mute-btn-${demo.id}`);
            
            let lastVolume = 1;

            audio.addEventListener('loadedmetadata', () => {
                seekBar.max = Math.floor(audio.duration);
                timeDisplay.innerText = `0:00 / ${formatTime(audio.duration)}`;
            });

            audio.addEventListener('timeupdate', () => {
                seekBar.value = Math.floor(audio.currentTime);
                timeDisplay.innerText = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
                
                const percentage = (audio.currentTime / audio.duration) * 100;
                seekBar.style.background = `linear-gradient(to right, #10b981 ${percentage}%, #1b2845 ${percentage}%)`;
            });

            playBtn.addEventListener('click', () => {
                if (currentAudioElement && currentAudioElement !== audio) {
                    currentAudioElement.pause();
                    const oldId = currentAudioElement.id.replace('audio-', '');
                    document.getElementById(`icon-${oldId}`).className = 'fa-solid fa-play ml-1';
                    document.getElementById(`eq-${oldId}`).classList.remove('opacity-100');
                    currentContainer.classList.remove('player-active');
                }

                if (audio.paused) {
                    audio.play();
                    playIcon.className = 'fa-solid fa-pause';
                    container.classList.add('player-active');
                    eqIndicator.classList.add('opacity-100');
                    currentAudioElement = audio;
                    currentContainer = container;
                } else {
                    audio.pause();
                    playIcon.className = 'fa-solid fa-play ml-1';
                    container.classList.remove('player-active');
                    eqIndicator.classList.remove('opacity-100');
                }
            });

            seekBar.addEventListener('input', () => {
                audio.currentTime = seekBar.value;
            });

            audio.addEventListener('ended', () => {
                playIcon.textContent = '&#xf04b;';
                container.classList.remove('player-active');
                eqIndicator.classList.remove('opacity-100');
                seekBar.value = 0;
                seekBar.style.background = '#1b2845';
            });

            const updateVolumeUI = (val) => {
                if (val === 0) volIcon.className = 'fa-solid fa-volume-xmark text-base w-5 text-center';
                else if (val < 0.5) volIcon.className = 'fa-solid fa-volume-low text-base w-5 text-center';
                else volIcon.className = 'fa-solid fa-volume-high text-base w-5 text-center';
                
                const percentage = val * 100;
                volBar.style.background = `linear-gradient(to right, #10b981 ${percentage}%, #1b2845 ${percentage}%)`;
            };

            if (volBar) {
                updateVolumeUI(1);

                volBar.addEventListener('input', () => {
                    const val = parseFloat(volBar.value);
                    audio.volume = val;
                    updateVolumeUI(val);
                });

                muteBtn.addEventListener('click', () => {
                    if (audio.volume > 0) {
                        lastVolume = audio.volume;
                        audio.volume = 0;
                        volBar.value = 0;
                    } else {
                        audio.volume = lastVolume > 0 ? lastVolume : 1;
                        volBar.value = audio.volume;
                    }
                    updateVolumeUI(audio.volume);
                });
            }
        });