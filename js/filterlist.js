
let urlFList = 'https://ga-mobile-api.loklok.tv/cms/app/search/list';
function filterList() {
    fetch(urlFList, requestOptions)
    .then(res => res.json())
    .then((data) => {
        getFilterList(data)
    })
    .catch(error => console.log('Lỗi:', error))
    function getFilterList(list) {
        //Type Film
        let cd = list.data;
        let cdHtml = document.getElementById('cd');
        let htmlCd = cd.map((item) => {
            return `
                <option value="${item.params}" class="option selected">${item.name}</option>`;
        })
        cdHtml.innerHTML = htmlCd.join('');
        //Area
        let getScreenItems = cd[0].screeningItems
        let areaHtml = document.getElementById('area');
        let htmlArea = getScreenItems[0].items.slice(0,12).map((item) => {
            return `
                <option value="${item.params}" class="option selected">${item.name}</option>`;
        })
        areaHtml.innerHTML = htmlArea.join('');
        //Category
        let cateHtml = document.getElementById('catefilm');
        let htmlCate = getScreenItems[1].items.slice(0,19).map((item) => {
            return `
                <option value="${item.params}" class="option selected">${item.name}</option>`;
        })
        cateHtml.innerHTML = htmlCate.join('');
        //Year
        let yearHtml = document.getElementById('year');
        let htmlYear = getScreenItems[2].items.slice(0,19).map((item) => {
            return `
                <option value="${item.params}" class="option selected">${item.name}</option>`;
        })
        yearHtml.innerHTML = htmlYear.join('');
    }
}
filterList()

function filterAction() {
    let cd = document.getElementById('cd');
        cd.onchange = (e) => {
            return e.target.value;
        }
    let area = document.getElementById('area');
        area.onchange = (e) => {
            return e.target.value;
        }
    let catefilm = document.getElementById('catefilm');
        catefilm.onchange = (e) => {
            return e.target.value;
        }
    let year = document.getElementById('year');
        year.onchange = (e) => {
            return e.target.value;
        }
    //Pagination
    function load(pg) {
        paginator({
            target : document.getElementById("demoB"),
            total : 485,  
            current : pg,
            click : load,
        });
        localStorage.setItem('num1', 0)
        localStorage.setItem('num2', pg*10)
    var options = {
        "url": "https://ga-mobile-api.loklok.tv/cms/app/search/v1/search",
        "method": "POST",
        "contentType": "application/json",
        "timeout": 0,
        "headers": {
            "lang": "vi",
            "versioncode": "11",
            "clienttype": "ios_jike_default"
        },
    "data": "{\n    \"size\": "+ pg*10 +",\n    \"params\": \""+`${cd.value}`+"\",\n    \"area\": \""+`${area.value}`+"\",\n    \"category\": \""+`${catefilm.value}`+"\",\n    \"year\": \""+`${year.value}`+"\",\n    \"subtitles\": \"\",\n    \"order\": \"up\"\n}",
    };
    $.ajax(options).done((response) => {
        //console.log(response);
        renderFilterList(response, pg);
    });
    }
    load(1);
    function renderFilterList(films, pg) {
        let num1 = localStorage.getItem('num1')
        let num2 = localStorage.getItem('num2')
        let htmls = films.data.searchResults.slice(num1, pg*10).map((items) => {
            return `
            <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <div class="product__item">
                <div class="product__item__pic">
                    <img class="set-bg" src="${items.coverVerticalUrl + '?imageView2/1/w/380/h/532/format/webp/interlace/1/ignore-error/1/q/90!/format/webp'}" loading="lazy">
                </div>
                <div class="product__item__text">
                    <h5><a href="/detail.html" onclick="saveIdMovie('${items.id}', '${items.domainType}')">${items.name}</a></h5>
                </div>
            </div>
        </div>`;
        })
        //Jquery
        $('#filterresult').html(htmls)
        if(pg*10 > 10) {
            let htmls = films.data.searchResults.slice(num2 - 10, num2).map((items) => {
                return `
                <div class="col-lg-3 col-md-3 col-sm-6 col-6">
                <div class="product__item">
                    <div class="product__item__pic">
                        <img class="set-bg" src="${items.coverVerticalUrl + '?imageView2/1/w/380/h/532/format/webp/interlace/1/ignore-error/1/q/90!/format/webp'}" loading="lazy">
                    </div>
                    <div class="product__item__text">
                        <h5><a href="/detail.html" onclick="saveIdMovie('${items.id}', '${items.domainType}')">${items.name}</a></h5>
                    </div>
                </div>
            </div>`;
        })
        $('#filterresult').html(htmls)
        }  
    }
}