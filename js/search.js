
function searchValue() {
    let input = document.getElementById('searchinput').value;
    localStorage.setItem('searchKey', input);
    location.href = '/search.html';
}

function getValue() {
    var myHeaders = new Headers();
    myHeaders.append("lang", "vi");
    myHeaders.append("versioncode", "11");
    myHeaders.append("clienttype", "ios_jike_default");
    myHeaders.append("Content-Type", "application/json");
    let value = localStorage.getItem('searchKey');

    var raw = "{\n    \"searchKeyWord\": \""+`${value}`+"\",\n    \"size\": 50,\n    \"sort\": \"\",\n    \"searchType\": \"\"\n}";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    fetch("https://ga-mobile-api.loklok.tv/cms/app/search/v1/searchWithKeyWord", requestOptions)
    .then(response => response.json())
    .then((result) => {
        renderSearchResult(result);
    })
    .catch(error => console.log('Lỗi:', error));
}
getValue()

function renderSearchResult(films) {
    let searchResult = document.getElementById('searchresult');
    let searchType = films.data.searchType;
    let arraySearchResult = films.data.searchResults;
    let htmls = arraySearchResult.map((item) => {
        return `
        <div class="col-lg-4 col-md-6 col-sm-6 col-6">
            <div class="product__item">
                <div class="product__item__pic">
                    <img class="set-bg" src="${item.coverVerticalUrl + '?imageView2/1/w/380/h/532/format/webp/interlace/1/ignore-error/1/q/90!/format/webp'}" loading="lazy">
                </div>
                <div class="product__item__text">
                    <ul>
                        <li>${searchType}</li>
                        <li>${item.releaseTime}</li>
                    </ul>
                    <h5><a href="/detail.html" onclick="saveIdMovie('${item.id}', '${item.domainType}')">${item.name}</a></h5>
                </div>
            </div>
        </div>`;
    })
    searchResult.innerHTML = htmls.join('');
    if (searchResult.innerHTML === '') {
        return searchResult.innerHTML = `
        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="product__item">
                <div class="product__item__text">
                    <h5 style='color:white'>"Không có kết quả tìm kiếm"</h5>
                </div>
            </div>
        </div>`
    }
}

function getLeaderBoard() {
    let url = 'https://ga-mobile-api.loklok.tv/cms/app/search/v1/searchLeaderboard';
    let myHeaders = new Headers();
    myHeaders.append("lang", "vi");
    myHeaders.append("versioncode", "11");
    myHeaders.append("clienttype", "ios_jike_default");

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    fetch(url, requestOptions)
    .then(res => res.json())
    .then((data) => {
        let listResult = data.data.list;
        let topSearch = document.getElementById('topsearch');
        for(let i = 1; i <= listResult.length;) {
        let htmls = listResult.map((item) => {
            return `
                <div class="product__sidebar__comment__item">
                    <div class="product__sidebar__comment__item__text">
                        <h5><a href="/detail.html" onclick="saveIdMovie('${item.id}', '${item.domainType}')">${i++}. ${item.title}</a></h5>
                    </div>
                </div>`;
        })
        topSearch.innerHTML = htmls.join(''); 
    }  
    })
    .catch(error => (console.log('Lỗi:', error)))
}
getLeaderBoard();