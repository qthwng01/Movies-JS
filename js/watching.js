
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
        console.log(data);
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
                return "Đang cập nhật";
            }
        })
        return cd.slice(0, 1);
    }
    
    let htmls = listEpisode.map((episode) => {
       return `<a id="mmbtn" style="cursor:pointer" onclick="getMovieMedia('${episode.id}', '${checkDefinition()}')">Tập ${episode.seriesNo}</a>`; 
    })
    list.innerHTML = htmls.join('');
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
        let mov = document.getElementById('movie');
        isSupported = mov.canPlayType('application/x-mpegURL');
        let source = document.getElementById('source__movie').src = data.data.mediaUrl;
            mov.load();
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
    let source = localStorage.getItem("url");
    const video = document.querySelector('video');
    const player = new Plyr(video, {
        captions: {  
            active: true, 
            update: true,
            language: 'vi'
    }});
    
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
});