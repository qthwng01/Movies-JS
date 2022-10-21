
let homeApi = 'https://ga-mobile-api.loklok.tv/cms/app/homePage/getHome?page=0';
let searchApi = 'https://ga-mobile-api.loklok.tv/cms/app/search/list';

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
    fetch(homeApi, requestOptions)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        renderSlide(data);
        renderTrending(data);
        renderTopChoose(data);
        renderKoreaFilm(data);
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    });  
}
getFilm();


function getCate() {
    fetch(searchApi, requestOptions)
    .then((respsonse) => {
        return respsonse.json();
    })
    .then((data) => {
        let cate = document.getElementById('category');
        let getCate = data.data;
        let htmls = getCate.map((getCate) => {
            return `
            <li><a href="#">${getCate.name}</a></li>
            `;
        })
        cate.innerHTML = htmls.join('');
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    })
}
getCate();


function getRegion() {
    fetch(searchApi, requestOptions)
    .then((respsonse) => {
        return respsonse.json();
    })
    .then((data) => {
        let cate = document.getElementById('category');
        let getCate = data.data;
        let htmls = getCate.map((getCate) => {
            return `
            <li><a href="#">${getCate.name}</a></li>
            `;
        })
        cate.innerHTML = htmls.join('');
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    })
}
getRegion();



function renderSlide(films) {

    //console.log(films.data.recommendItems);
    let getReCommendItems = films.data.recommendItems;

    let listTrending = document.getElementById('slide');
    let getReCommendContentVOList = getReCommendItems.map(function(getReCommendItems) {
        return getReCommendItems.recommendContentVOList;
    })

    let htmls = getReCommendContentVOList[0].slice(0, 6).map(function(data) {
        return `
        <div class="swiper-slide">   
            <a href="#"><img class="img__slide" src="${data.imageUrl}" alt="#"></a>
        </div>`;
    })       
    listTrending.innerHTML = htmls.join('');
}

function renderTrending(films) {

    //console.log(films.data.recommendItems);
    let getReCommendItems = films.data.recommendItems;

    let listTrending = document.getElementById('trending');
    let getReCommendContentVOList = getReCommendItems.map(function(getReCommendItems) {
        return getReCommendItems.recommendContentVOList;
    })

    let htmls = getReCommendContentVOList[1].slice(0, 8).map(function(data) {
        return `
        <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="product__item">
                <div class="product__item__pic">
                <img class="set-bg" src="${data.imageUrl + '?imageView2/1/w/380/h/532/format/webp/interlace/1/ignore-error/1/q/90!/format/webp'}" loading="lazy">
                <div class="comment"><i class="fa fa-star"></i> ${data.score}</div>
                <div class="view"><i class="fa fa-calendar"></i> ${data.releaseTime}</div>
                </div>
                <div class="product__item__text">
                <ul>
                    <li>${data.dramaTypeVo.dramaName}</li>
                    <li>${data.dramaTypeVo.dramaType}</li>
                </ul>
                <h5><a href="/detail.html" onclick="saveIdMovie('${data.id}', '${data.category}')">${data.title}</a></h5>
            </div>
            </div>
        </div>`;
    })
    listTrending.innerHTML = htmls.join('');  
}

function renderTopChoose(films) {

    //console.log(films.data.recommendItems);
    let getReCommendItems = films.data.recommendItems;

    let listTrending = document.getElementById('topchoose');
    let getReCommendContentVOList = getReCommendItems.map(function(getReCommendItems) {
        return getReCommendItems.recommendContentVOList;
    })

    let htmls = getReCommendContentVOList[4].slice(0, 8).map(function(data) {
        return `
        <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="product__item">
                <div class="product__item__pic">
                <img class="set-bg" src="${data.imageUrl + '?imageView2/1/w/380/h/532/format/webp/interlace/1/ignore-error/1/q/90!/format/webp'}" loading="lazy">
                <div class="comment"><i class="fa fa-star"></i> ${data.score}</div>
                <div class="view"><i class="fa fa-calendar"></i> ${data.releaseTime}</div>
                </div>
                <div class="product__item__text">
                <ul>
                    <li>${data.dramaTypeVo.dramaName}</li>
                    <li>${data.dramaTypeVo.dramaType}</li>
                </ul>
                <h5><a href="/detail.html" onclick="saveIdMovie('${data.id}', '${data.category}')">${data.title}</a></h5>
                </div>
            </div>
        </div>`;
    })       
    listTrending.innerHTML = htmls.join('');
}

function renderKoreaFilm(films) {

    //console.log(films.data.recommendItems);
    let getReCommendItems = films.data.recommendItems;

    let listTrending = document.getElementById('koreafilm');
    let getReCommendContentVOList = getReCommendItems.map(function(getReCommendItems) {
        return getReCommendItems.recommendContentVOList;
    })

    let htmls = getReCommendContentVOList[3].slice(0, 8).map(function(data) {
        return `
        <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="product__item">
                <div class="product__item__pic">
                <img class="set-bg" src="${data.imageUrl + '?imageView2/1/w/380/h/532/format/webp/interlace/1/ignore-error/1/q/90!/format/webp'}" loading="lazy">
                <div class="comment"><i class="fa fa-star"></i> ${data.score}</div>
                <div class="view"><i class="fa fa-calendar"></i> ${data.releaseTime}</div>
                </div>
                <div class="product__item__text">
                <ul>
                    <li>${data.dramaTypeVo.dramaName}</li>
                    <li>${data.dramaTypeVo.dramaType}</li>
                </ul>
                <h5><a href="/detail.html" onclick="saveIdMovie('${data.id}', '${data.category}')">${data.title}</a></h5>
            </div>
            </div>
        </div>`;
    })       
    listTrending.innerHTML = htmls.join('');
}


function saveIdCollection(id) {
   localStorage.setItem("idCollection", id);
   //var cc = localStorage.getItem("idCollection");
   //var cl = localStorage.clear();
}

function saveIdMovie(id, cate) {

    const detailMovie = {
            id: id,
            category: cate,
        }
    window.localStorage.setItem("idMovie",JSON.stringify(detailMovie));
    //var cc = localStorage.getItem("idMovie");
}