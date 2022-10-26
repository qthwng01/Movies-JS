
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
        startFilm(data);
        renderDetailFilm(data);
        renderLikeList(data);
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    }); 
}
getFilm();

function renderDetailFilm(film) {
    localStorage.removeItem('searchKey');
    let data = film.data;
    function checkName() {
        if(data.aliasName === "") {
            return data.name;
        }
        if(data.aliasName.toLowerCase) {
            return data.name;
        }
        else {
            var str = data.aliasName;
            var arr = str.split(",");
            arr.splice(1).join("");
            var rest = arr.join(",");
            return rest;
        }
    }
    //Array EpisodeVO
    let arrEpisodeVO = film.data.episodeVo;
    
    //Array Definition List
    let definitionList = arrEpisodeVO[0].definitionList;

    function checkActor() {
        if(data.starList.length === 0) {
            return 'Đang cập nhật';
        }
        else {
            let actor = data.starList.map((star) => {
                return star.localName;
            })
            return actor.join(', ');
        } 
    }

    function checkQuality() {
        if(definitionList[0].code === "GROOT_HD") {
            return '1080p';
        }
        if(definitionList[0].code === "GROOT_SD") {
            return '720p';
        }
        if(definitionList[0].code === "GROOT_FD") {
            return '540p';
        }
        else {
            return '360p (CAM)';
        }
    }

    function checkEpisodeCount() {
        if(data.episodeCount === null) {
            return '1';
        } else {
            return data.episodeCount
        }
    }

    function checkEpisodeVO() {
        if(data.episodeVo.length === 0) {
            return 'None'
        } else {
            return data.episodeVo.length;
        }
    }

    //Breadcumb
    let brc = document.getElementById('breadcumb');
        brc.innerHTML += `
            <a href="/index.html"><i class="fa fa-home"></i> Trang chủ</a>
            <a href="#">${data.drameTypeVo.drameName}</a>
            <span>${data.name}</span>`;

    let html = document.getElementById('detail');
        html.innerHTML += `<div class="col-lg-3">
        <div class="anime__details__pic">
            <img class="set-bg" src="${data.coverVerticalUrl}" alt="#">
        </div>
    </div>
    <div class="col-lg-9">
        <div class="anime__details__text">
            <div class="anime__details__title">
                <h3>${data.name}</h3>
                <span>${checkName()}</span>   
            </div>
            
            <p>${data.introduction}</p>
            <div class="anime__details__widget">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <ul>
                            <li><span>Loại phim:</span> ${data.drameTypeVo.drameName} / ${data.drameTypeVo.drameType}</li>
                            <li><span>Quốc gia:</span> ${data.areaNameList}</li>
                            <li><span>Năm phát hành:</span> ${data.year}</li>
                            <li><span>Thể loại:</span> ${data.tagNameList.join(', ')}</li>
                        </ul>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <ul>
                            <li><span>Điểm IMDb:</span> ${data.score}</li>
                            <li><span>Trạng thái:</span>Tập ${checkEpisodeVO()} / ${checkEpisodeCount()}</li>
                            <li><span>Chất lượng:</span> ${checkQuality()}</li>
                            <li><span>Diễn viên:</span> ${checkActor()}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="anime__details__btn">
                <a href="#" class="follow-btn">Trailer</a>
                <a href="/watching.html" class="watch-btn"><span>Xem Phim</span> <i
                    class="fa fa-angle-right"></i></a>
                </div>
            </div>
        </div>
    </div>`
}

function renderLikeList(films) {
    let likeList = document.getElementById('likelist');
    let dataLikeList = films.data.likeList;
    let htmls = dataLikeList.map((item) => {
        return `
            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                <div class="product__item">
                    <div class="product__item__pic">
                    <img class="set-bg" src="${item.coverVerticalUrl}" loading="lazy">
                    <div class="comment"><i class="fa fa-star"></i> ${item.score}</div>
                    <div class="view"><i class="fa fa-calendar"></i> ${item.year}</div>
                    </div>
                    <div class="product__item__text">
                    <h5><a href="/detail.html" onclick="saveIdMovie('${item.id}', '${item.category}')">${item.name}</a></h5>
                    </div>
                </div>
            </div>`; 
    })
    likeList.innerHTML = htmls.join('');
}

function saveIdMovie(id, cate) {
    const detailMovie = {
            id: id,
            category: cate,
        }
    window.localStorage.setItem("idMovie",JSON.stringify(detailMovie)); 
}

function startFilm(film) { 
    let listEpisode = film.data.episodeVo;
    const getFirstId = listEpisode[0].id;
    localStorage.setItem("idEpisode", getFirstId);
    function checkQuality() {
        let quality = listEpisode[0].definitionList;
        if(quality[0].code === "GROOT_HD") {
            return "GROOT_HD";
        }
        if(quality[0].code === "GROOT_SD") {
            return "GROOT_SD";
        }
        if(quality[0].code === "GROOT_FD") {
            return "GROOT_FD";
        }
        if(quality[0].code === "GROOT_LD") {
            return "GROOT_LD";
        }
    }
    var idMove = localStorage.getItem("idMovie");
    var prop = JSON.parse(idMove);
    let movieMedia = `https://ga-mobile-api.loklok.tv/cms/app/media/previewInfo?category=${prop.category}&contentId=${prop.id}&episodeId=${getFirstId}&definition=${checkQuality()}`;
    fetch(movieMedia, requestOptions)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        source(data);
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    })
    function source(data) {
        let source = data.data.mediaUrl;
        localStorage.setItem("url", source);
    }
}