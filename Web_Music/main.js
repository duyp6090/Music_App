/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/Pause/ Seek
 * 4. CD rotate
 * 5. Next/Prev
 * 6. Random
 * 7. Next/repeat khi ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. click song in list
 **/




const $ = document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);

const player = $('.player');
const playList = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const PLAYER_STORAGE_KEY = 'DUYMAO_PLAYER';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name:'Bên nhau thật khó remix',
            singer:'Châu Khải Phong & Khang Việt',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/1.jpg'
        },
        {
            name:'Thất Tình remix',
            singer:'Trịnh Đình Quang',
            path:'./assets/music/song2.mp3',
            image:'./assets/image/2.jpg'
        },
        {
            name:'Nhạc sàn remix cực hay',
            singer:'TikTok',
            path:'./assets/music/song3.mp3',
            image:'./assets/image/3.jpg'
        },
        {
            name:'Nếu em không gặp may remix',
            singer:'Cao Tùng Huy',
            path:'./assets/music/song4.mp3',
            image:'./assets/image/4.jpg'
        },
        {
            name:'Cô đơn dành cho ai remix',
            singer:'LEEKEN x NAL',
            path:'./assets/music/song5.mp3',
            image:'./assets/image/5.jpg'
        },
        {
            name:'Chạnh lòng thương cô remix',
            singer:'Huy Vạc',
            path:'./assets/music/song6.mp3',
            image:'./assets/image/6.jpg'
        },
        {
            name:'Cô độc vương remix',
            singer:'Thái Quỳnh',
            path:'./assets/music/song7.mp3',
            image:'./assets/image/7.jpg'
        },
        {
            name:'Khóc cho người ai khóc cho anh remix',
            singer:'Gia Huy',
            path:'./assets/music/song8.mp3',
            image:'./assets/image/8.jpg'
        },
        {
            name:'Như bến đợi đò remix',
            singer:'Hana Cẩm Tiên & Khánh Ân',
            path:'./assets/music/song9.mp3',
            image:'./assets/image/9.jpg'
        },
        {
            name:'Câu hứa chưa vẹn tròn remix',
            singer:'Phát Huy',
            path:'./assets/music/song10.mp3',
            image:'./assets/image/10.jpg'
        },
        {
            name:'Như một người dưng remix',
            singer:'Nguyễn Thạc Bảo Ngọc',
            path:'./assets/music/song11.mp3',
            image:'./assets/image/11.jpg'
        },
        {
            name:'Không bằng remix',
            singer:'Na',
            path:'./assets/music/song12.mp3',
            image:'./assets/image/12.jpg'
        },
        {
            name:'Chỉ là ta đã từng yêu remix',
            singer:'Thiên Tú',
            path:'./assets/music/song13.mp3',
            image:'./assets/image/13.jpg'
        },
        {
            name:'Cô gái vàng remix',
            singer:'HuyR x Tùng Viu x Quang Đăng',
            path:'./assets/music/song14.mp3',
            image:'./assets/image/14.jpg'
        },
        {
            name:'Anh không tha thứ remix',
            singer:'Đình Dũng',
            path:'./assets/music/song15.mp3',
            image:'./assets/image/15.jpg'
        }
    ],
    render: function() {
        const htmls =  this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                 <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });
        playList.innerHTML = htmls.join('');
    },
    definePropertys: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xu li cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // xu li phong to thu nho CD
        document.onscroll = function() {
            const scrollY = window.scrollY;
            const newCdWidth = cdWidth - scrollY;
            cd.style.width = newCdWidth > 0 ? newCdWidth +'px': 0;
            cd.style.opacity = newCdWidth /cdWidth;
        }

        // xu li khi click play song
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();    
            }
            else{
                audio.play();
            }

            // khi play song
            audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            // khi pause song
            audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            // khi tien do bai hat thay doi
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime/audio.duration*100);
                    progress.value = progressPercent;
                }
            }

            //xu li bai hat khi tua
            progress.onchange = function(e) {
                const seekTime = audio.duration/100 *e.target.value;
                audio.currentTime = seekTime;
            }

            // khi next bai tiep theo
            nextBtn.onclick = function() {
                if(_this.isRandom){
                    _this.playRandomSong();
                }
                else{
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }

            // khi prev bai phia sau
            prevBtn.onclick = function() {
                if(_this.isRandom){
                    _this.playRandomSong();
                }
                else{
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }

            // xu li bat tat random song
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom;
                _this.setConfig('isRandom', _this.isRandom);
                randomBtn.classList.toggle('active', _this.isRandom);
            }
            
            // xu li khi yeu cau nghe lai audio
            repeatBtn.onclick = function() {
               _this.isRepeat = !_this.isRepeat;
               _this.setConfig('isRepeat', _this.isRepeat);
               repeatBtn.classList.toggle('active', _this.isRepeat);
            }

            // xu li next song  khi audio ended
            audio.onended = function() {
                if(_this.isRepeat) {
                   audio.play();
                }
                else{
                    nextBtn.click();
                }
            }
        }

        // lang nghe click  vao playlist
        playList.onclick = function(e) {
            // xu li khi click vao song.
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode || (!e.target.closest('.option)')))
            {
                // khi click vao song
               if(songNode) {
                  _this.currentIndex = Number(songNode.dataset.index);
                  _this.loadCurrentSong();
                  audio.play();
                  _this.render();
               }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex > this.songs.length-1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex = this.currentIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(this.currentIndex == newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        var blockStyle ='nearest';
        if(this.currentIndex >= 6 || this.currentIndex <=0) blockStyle = 'center';
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
               behavior: 'smooth',
               block: blockStyle,
            })
        },300)
    },
    start: function () {
        // luu lai config
        this.loadConfig();

        // dinh nghia thuoc tinh cho object
        this.definePropertys();

        // lang nghe xu li cac su kien
        this.handleEvents();
        
        //tai bai hat hien tai vao UI khi chay ung dung
        this.loadCurrentSong();

        //render playlist
        this.render();
    }
}

app.start();