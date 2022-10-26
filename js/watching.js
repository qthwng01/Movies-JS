
function detailApi() {
    var idMove = localStorage.getItem("idMovie");
    var prop = JSON.parse(idMove);
    let homeApi = `https://ga-mobile-api.loklok.tv/cms/app/movieDrama/get?id=${prop.id}&category=${prop.category}`;
    return homeApi;
}

let myHeaders = new Headers();
myHeaders.append("lang", "vi");
myHeaders.append("versioncode", "11");
myHeaders.append("clienttype", "ios_jike_default");

let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

function getFilm() {
    fetch(detailApi(), requestOptions)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        //console.log(data);
        renderDetailFilm(data);
        getUrlSubLang(data);
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    });  
}
getFilm();

function renderDetailFilm(films) {
    let listEpisode = films.data.episodeVo;
    let breadCumb = document.getElementById('breadcumb');
    let list = document.getElementById('listepisode');
    function checkDefinition() {
        let cd = listEpisode.map((item) => {
            if(item.definitionList[0].code === "GROOT_HD") {
                return "GROOT_HD";
            }
            if(item.definitionList[0].code === "GROOT_SD") {
                return "GROOT_SD";
            }
            if(item.definitionList[0].code === "GROOT_FD") {
                return "GROOT_FD";
            }
            if(item.definitionList[0].code === "GROOT_LD") {
                return "GROOT_LD";
            }
        })
        return cd.slice(0, 1);
    }
    let htmls = listEpisode.map((episode) => {
        function checkEpisodeVO() {
            if(episode.seriesNo === 0) {
                return 'Full';
            } else {
                return episode.seriesNo;
            }
        }
       return `<a id="mmbtn" style="cursor:pointer" onclick="getMovieMedia('${episode.id}', '${checkDefinition()}')">Tập ${checkEpisodeVO()}</a>`; 
    })
    list.innerHTML = htmls.join('');
    breadCumb.innerHTML += `
        <a href="#">${films.data.drameTypeVo.drameName}</a>
        <span>${films.data.name}</span>`;
}

function getMovieMedia(id, def) {
    localStorage.setItem("idEpisode", id);
    var idMove = localStorage.getItem("idMovie");
    var prop = JSON.parse(idMove);
    let movieMedia = `https://ga-mobile-api.loklok.tv/cms/app/media/previewInfo?category=${prop.category}&contentId=${prop.id}&episodeId=${id}&definition=${def}`;
    
    fetch(movieMedia, requestOptions)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        source(data); 
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    });  
    function source(data) {
        let source = data.data.mediaUrl;
        window.location.reload();
        localStorage.setItem("url", source);     
    }
}

/* Captions Setup */
function getUrlSubLang(data) {
    const ide = localStorage.getItem("idEpisode");
    var ck = data.data.episodeVo;
    var cl = ck.filter((cl) => {
        return cl.id === Number(ide);
    })
    var dm = cl.reduce((a, b) => {
        return b.subtitlingList;
    })
    var cdg = dm.subtitlingList;   
            
    var tdn = cdg.filter((tdn) => {
        return tdn.language === 'Tiếng Việt';
    })
    var qq = tdn[0].subtitlingUrl;
    fetch(qq)
    .then(response => response.text())
    .then(result => {
        let srtText = result;
        var srtRegex = /(.*\n)?(\d\d:\d\d:\d\d),(\d\d\d --> \d\d:\d\d:\d\d),(\d\d\d)/g;
        var vttText = 'WEBVTT\n\n' + srtText.replace(srtRegex, '$1$2.$3.$4');
        var vttBlob = new Blob([vttText], {
            type: 'text/vtt'
        });
        var blobURL = URL.createObjectURL(vttBlob);
        track = document.createElement("track");
        track.kind = "captions";
        track.label = "Tiếng Việt";
        track.srclang = "vi";
        track.src = blobURL;
        track.setAttribute('default', '');  
        if(track.src === undefined) {
            document.getElementById("movie").removeChild(track);
        }
        else {
            document.getElementById("movie").appendChild(track);
        }
    })
    .catch(error => console.log('Lỗi:', error));
}

/* Player Setup */
document.addEventListener('DOMContentLoaded', () => {  
    let source = localStorage.getItem('url');
    const video = document.querySelector('video');
    const controls = [
        'play-large', // The large play button in the center
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'settings', // Settings menu
        'fullscreen' // Toggle fullscreen
    ];
    const player = new Plyr(video, {
        captions: {  
            active: true, 
            update: true,
            language: 'vi'
        },
        controls,
    });
    
    if (!Hls.isSupported()) {          
        video.src = source;
    } else {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        window.hls = hls;
        
        // Handle changing captions
        /* player.on('languagechange', () => {
            setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
        }); */
        player.on('enterfullscreen', event => {
            screen.orientation.lock('landscape');
        });
        
        player.on('exitfullscreen', event => {
            screen.orientation.lock('portrait');
        });
    }
    window.player = player;
    player.play();
});
