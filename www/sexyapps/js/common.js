//APIKEYなど
var API_ID = "NFcDM3yDYSkGmUt1B0tK";
var AFFILIATE_ID = "sexyapps-990";
var OFFSET = 50;

var MENU_ARRAY = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"];



//classが指定していないボタンタグにデフォルトのクラスを指定する
$(function(){
    $("button").each(function(){
        if($(this).hasClass("")){
            $(this).addClass("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
        }
    });
});


function build_api_url(api_id, affiliate_id, hits, page, keyword){

    //floorフロア
    /*
        ビデオ：videoa
        素人：videoc
        成人映画：nikkatsu
        アニメ：anime
        電子写真集：photo
    */

    console.log("---page---");
    console.log(page);
    console.log("---offset---");
    var offset = Number(page)*Number(hits) - Number(hits) + 1 ;
    console.log(offset);

    //keywordはEUC-jpでURLエンコードしてね
    var api_url =   "http://www.udonko.net/cors.php/?api_id="+ api_id +
                "&affiliate_id="+ affiliate_id +
                "&operation=ItemList&version=2.00&timestamp="+get_timestamp()+
                "&site=DMM.co.jp&hits="+ hits +
                "&offset="+ offset +
                "&service=digital" +
                "&floor=videoc" +
                "&sort=review&keyword="+ keyword;

/*
    api_url =   "http://affiliate-api.dmm.com/?api_id="+ api_id +
                "&affiliate_id="+ affiliate_id +
                "&operation=ItemList&version=2.00&timestamp= "+ get_timestamp() +
                "&site=DMM.co.jp&hits="+ hits +
                "&offset="+ offset +
                "&service=digital" +
                "&floor=videoc" +
                "&sort=review&keyword="+ keyword;
*/

    console.log(api_url);

    return api_url;
}

function get_timestamp(){
    //Dateオブジェクトを利用
    var d = new Date();
    var year  = d.getFullYear();
    var month = d.getMonth() + 1;
    var day   = d.getDate();
    var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
    var timestamp = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

    return timestamp;
}

//pageは初期値は0を指定する
function request(page){

    //１ページ目（新規で検索した時は結果を消しておく）
    if(page <= 1){
        clear_page();
    }

    //loading中
    display_loading(true);

    //getパラメータから検索キーワードを取得
    keyword = EscapeEUCJP(getParam());

    //現在ページの表示を更新
    $("#current_page").val(Number(page));

    //現在ページは-1した値を渡す。次へボタンようでインクリメントしているので。
    api_url = build_api_url(API_ID, AFFILIATE_ID, OFFSET, page, keyword);
    $.ajax({
        type: 'GET',
        async: true,
        url: api_url,
        dataType: "xml",
        contentType: "application/xml; charset=EUC-jp",
        cache: false,
        success: function(response) {
           //リスト表示
           display_product(response);
        },
        error: function(response) {
            console.log(response);
            alert("エラー");
        },
        complete:function(response){
            //loading終了
            display_loading(false);
        }
	});
}

function display_product(response){
    console.log("ページ");
    //表示数
    console.log($(response).find('result_count').text());
    //検索合計
    console.log($(response).find('total_count').text());
    total_pages = Math.ceil(Number($(response).find('total_count').text()) / OFFSET);

    $("#pager_label").text("ページ指定:1~"+total_pages);
    $("#pager_slider").attr({
        max: total_pages,
        min: 1,
    });


    //商品データ表示カード
    $(response).find('item').each(function(i){
        //ヒアドキュメント
        var heredoc = (function () {/*
            <div class="mdl-cell mdl-cell--12-col-phone mdl-cell--3-col-desktop" style="background-color:#ffffff">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title" style="background: url('${tmp_image_url}') top / cover;">
                        <h2 class="mdl-card__title-text">${tmp_title}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        出演:&nbsp<strong>${tmp_actress}</strong><br />
                        シリーズ:&nbsp;<strong>${tmp_series}</strong><br />
                        レーベル:&nbsp;<strong>${tmp_label}</strong><br />
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <div style="float:right;">
                        </div>
                        <button class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect"><a href="${tmp_url}">動画をみる</a></button>
                    </div>
                </div>
            </div>
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

        /*
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                <i class="fa fa-google-plus"></i>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                <i class="fa fa-facebook"></i>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                <i class="fa fa-twitter"></i>
            </button>
        */


        var title = $(this).find('title').text();
        var image_url = $(this).find('imageURL').find('large').text();
        var actress = $(this).find('iteminfo').find('actress').eq(0).find('name').text();
        var series = $(this).find('iteminfo').find('series').eq(0).find('name').text();
        var label = $(this).find('iteminfo').find('label').eq(0).find('name').text();
        var url = $(this).find('affiliateURL').text();

        //テンプレに挿入
        var object = {
            tmp_title: title,
            tmp_actress: actress,
//            tmp_image_url: image_url,
            tmp_series: series,
            tmp_label: label,
            tmp_url: url
        }
        var html = jQuery.tmpl(heredoc, object);
        $('#products_list').append(html);
    });
}

//検索結果を消す
function clear_page(){
    $('#products_list').text("");
}

//pagerスライダー
function change_slider(){
    value = $('#pager_slider').val();
    console.log(value);
    $('#current_page').val(value);
}

//プログレスバーの表示切り替え
function display_loading(hidden){
    if(hidden){
        $("#progress_bar").show();
    }else{
        $("#progress_bar").hide();
    }
}


//getパラメータを取得 searchの値を返す
function getParam() {
    var url = location.href;
    console.log("----url----");
    console.log(url);

    //getパラメータがurlについてない時は、初期値を返す
    if(url.indexOf("?search=") == -1){
        console.log("searchなし");
        return "巨乳";
    }else{
        console.log("searchあり");
    }

    //getパラメータを取得
    parameters = url.split("?");
    params = parameters[1].split("&");
    var paramsArray = [];
    for ( i = 0; i < params.length; i++ ) {
        neet = params[i].split("=");
        paramsArray.push(neet[0]);
        paramsArray[neet[0]] = neet[1];
    }

    //searchパラメータの値を返す
    var categoryKey = paramsArray["search"];
    console.log("---search---");
    console.log(decodeURIComponent(categoryKey));
    return decodeURIComponent(categoryKey);
}

//次のページへ
function nextPage(){
    var nextpage = Number($('#current_page').val());
    nextpage++;
    return nextpage;
}
