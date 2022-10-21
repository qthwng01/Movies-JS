
let homeApi = 'https://ga-mobile-api.loklok.tv/cms/app/homePage/getHome?page=0';
//let searchApi = 'https://ga-mobile-api.loklok.tv/cms/app/search/list';

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
        renderCollection(data);
    })
    .catch((error) => {
        console.log('Lỗi:', error);
    });  
}
getFilm();

function renderCollection(films) {
    var id = localStorage.getItem("idCollection");
    let getReCommendItems = films.data.recommendItems;
    let listTrending = document.getElementById('collection');
    //let breadCumb = document.getElementById('breadcumb');
    let getReCommendContentVOList = getReCommendItems.map(function(getReCommendItems) {
        return getReCommendItems.recommendContentVOList;
    })

    let htmls = getReCommendContentVOList[id].map(function(data) {
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

    let htmls2 = document.getElementById('breadcumb');
        htmls2.innerHTML += "<span>"+getReCommendItems[id].homeSectionName+"</span>";
    
    let htmls3 = document.getElementById('sectiontitle');
        htmls3.innerHTML += "<h4>"+getReCommendItems[id].homeSectionName+"</h4>";    
    
    /* if(!location.href === '/collection.html') {
        localStorage.removeItem("idCollection");
    } */
}
//console.log(localStorage.getItem("idCollection"));

function saveIdMovie(id, cate) {

    const detailMovie = {
            id: id,
            category: cate,
        }
    window.localStorage.setItem("idMovie",JSON.stringify(detailMovie));
    //var cc = localStorage.getItem("idMovie");
}