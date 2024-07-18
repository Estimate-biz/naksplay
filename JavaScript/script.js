let currentSong = new Audio()
let metaTag = document.querySelector('meta[http-equiv="refresh"]')
const play_btn = document.getElementById('play-btn')
const previous_btn = document.getElementById('previous-btn')
const next_btn = document.getElementById('next-btn')
let songs;
let song_ul = document.getElementsByClassName('song-ul')[0]
let body = document.querySelector("body")
let hamBurger = document.querySelector(".menu-icon")
let left_Portion = document.querySelector(".left")
let cross = document.querySelector(".cross")
let cards = document.querySelectorAll(".card")
let folder = "EverySong";

if (metaTag) {
    metaTag.remove();
}

// window.addEventListener('beforeunload', function(event) {
    // event.preventDefault();
    // // Optionally, you can remove the confirmation message:
    // event.returnValue = '';
    // });
    
    // cards.forEach(element => {
    //     element.addEventListener("click", () => {
    //         let obj = JSON.parse(JSON.stringify(element.dataset))
    //         folder = (Object.values(obj)[0])
    //     })
    // });


    
    
    hamBurger.addEventListener('click', ()=>{
        left_Portion.style.left = '0'
    })
    
    cross.addEventListener('click', ()=>{
        left_Portion.style.left = '-100%'
    })
    
    
    function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds<0) {
            return "00:00"
        }
        
        const minutes = Math.floor(seconds/60)
        const remainingSeconds = Math.floor(seconds%60)
        
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')
    
    return `${formattedMinutes}:${formattedSeconds}`
}

play_btn.addEventListener("click",()=>{
    if (!currentSong.hasAttribute("src")) {
        currentSong.src = songs[0]
        let mySongName = currentSong.src
        
        let actualName = mySongName.split('-')
        let replacedprec20Name = actualName[1].replaceAll("%20", " ")
        let completeName = replacedprec20Name.replace(".mp3", "")

        console.log(completeName);

        document.querySelector(".song-info").innerHTML=completeName
    }
})

async function getSongs(folder) {

    let s = await fetch(`http://127.0.0.1:5500/songs/${folder}`)
    let response = await s.text()
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    // console.log(as);
    
    
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }
    return songs;
}


play_btn.addEventListener("click", ()=>{
    
    if (currentSong.paused) {
        currentSong.play()
        play_btn.classList.toggle('bx-pause-circle')
        play_btn.classList.toggle('bx-play-circle')
    } else {
        currentSong.pause()
        play_btn.classList.toggle('bx-play-circle')
        play_btn.classList.toggle('bx-pause-circle')
    }
    
    
})

function playMusic(elementName, folder) {
    let changedName = elementName.replaceAll(" ", "%20")
    // let audio = new Audio(`/songs/spotifydown.com%20-${changedName}.mp3`);
    currentSong.src = `songs/${folder}/spotifydown.com%20-${changedName}.mp3`
    
    console.log(currentSong);
    
    currentSong.play()
    
    document.querySelector(".song-info").innerHTML=elementName
    
    
    if (currentSong.paused) {
        currentSong.play();
    }else{
        currentSong.currentTime = 0
    }
    
    
}

const draggableElement = document.querySelector('.mover');

let isDragging = false;
let startX;

draggableElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - draggableElement.offsetLeft;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - startX;
    
  let item = draggableElement.style.left = `${x}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

async function main() {
    songs = await getSongs(folder)
    // console.log(songs);
    
    for (const song of songs) { 
        
        let actualName = song.split('-')
        let replacedprec20Name = actualName[1].replaceAll("%20", " ")
        let completeName = replacedprec20Name.replace(".mp3", "")
        song_ul.innerHTML = song_ul.innerHTML + `<li class="songName">${completeName}</li>`
        
    }
    
    let playbleAudio = document.querySelectorAll(".songName")
    playbleAudio.forEach((ele, index)=>{
        let elementName = ele.innerHTML
        ele.addEventListener("click",  element=>{
            playMusic(elementName, folder)
            play_btn.classList.add('bx-pause-circle')
            play_btn.classList.remove("bx-play-circle")
            
        })
        
        
    })
    const songLength = document.querySelector("#songLength")
    let mover = document.querySelector(".mover")
    let seekBar = document.querySelector(".seekBar")
    
    currentSong.addEventListener("timeupdate", ()=>{
        
        
        SongRunningTime = currentSong.currentTime       
        SongDuration = currentSong.duration
        songLength.innerHTML = `${secondsToMinutesSeconds(SongRunningTime)}/${secondsToMinutesSeconds(SongDuration)}`
        mover.style.left=(SongRunningTime/SongDuration)*100 + "%"
        
        
        seekBar.addEventListener("click", (position)=>{
            let currentPosition = position.offsetX
            let SeekbarWidth = position.target.getBoundingClientRect().width
            let percent = (currentPosition/SeekbarWidth)*100
            mover.style.left = percent + "%"
            currentSong.currentTime = ((SongDuration) * percent)/100
        })
    })
    
    previous_btn.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src)
        
        if((index) > 0){
            let nextSong = songs[index-1].split("-")[1]
            let replacedprec20Name = nextSong.replaceAll("%20", " ")
            let completeName = replacedprec20Name.replace(".mp3", "")
            playMusic(completeName)
            play_btn.classList.add('bx-pause-circle')
            play_btn.classList.remove("bx-play-circle")
        }
    })
    
    next_btn.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src)
        
        if((index+1) < songs.length){
            let nextSong = songs[index+1].split("-")[1]
            let replacedprec20Name = nextSong.replaceAll("%20", " ")
            let completeName = replacedprec20Name.replace(".mp3", "")
            playMusic(completeName)
            play_btn.classList.add('bx-pause-circle')
            play_btn.classList.remove("bx-play-circle")
        }
    })


    
}


main()

