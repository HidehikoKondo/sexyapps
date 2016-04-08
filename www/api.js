//APIKEYなど
var API_ID = "NFcDM3yDYSkGmUt1B0tK";
var AFFILIATE_ID = "sexyapps-990";

//検索件数
var hits = 100;

//データのリクエスト
function request(page, bustsize){
    //ローディング表示
    show_loading(true);
    var api_url = api_url_actress(API_ID, AFFILIATE_ID, hits, page, bustsize)

    console.log("api_url");
    console.log(api_url);

    $.ajax({
        type: 'GET',
        async: true,
        url: api_url,
        dataType: "jsonp",
        cache: false,
        success: function(json) {
            create_product_list(json);
        },
        error: function(json) {
            console.log(json);
            alert("エラー");
        },
        complete:function(json){
            //loading終了
            show_loading(false);
        }
	});


    return;
}

function create_product_list(json){
    console.log(json);
    var actress_list = json.result.actress;
    $(actress_list).each(function(i){
        var actress = actress_list[i];

        console.log(actress.name);
        console.log(actress.bust);
        console.log(actress.waist);
        console.log(actress.hip);
        console.log(actress.cup);
        console.log(actress.height);
        console.log(actress.listURL.digital);
        //ヒアドキュメント
        var heredoc = (function () {/*
            <div class="mdl-cell mdl-cell--3-col-desktop	">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title" style="background: url('${tmp_image_url}') top / cover;">
                        <h2 class="mdl-card__title-text">${tmp_name}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        <strong>B:${tmp_bust} W:${tmp_waist} H:${tmp_hip}</strong><br />
                        <strong>${tmp_cup}カップ</strong><br />
                        <strong>${tmp_height}cm</strong>
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <button class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect" onclick="window.open('${tmp_list_url}')">動画をみる</button>
                    </div>
                </div>
            </div>*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

        //TODO 画像以外もnullチェックちゃんとやっとこう
        var imageURL = "jacket.jpg";
        var name = "-";
        var bust = "-";
        var hip = "-";
        var waist = "-";
        var cup = "-";
        var height = "-";
        var list_url = "http://www.sexyapps.download";

        if(actress.name){
            name = actress.name;
        }
        if(actress.imageURL){
            imageURL = actress.imageURL.large;
        }
        if(actress.bust){
            bust = actress.bust;
        }
        if(actress.waist){
            waist = actress.waist;
        }
        if(actress.hip){
            hip = actress.hip;
        }
        if(actress.cup){
            cup = actress.cup;
        }
        if(actress.height){
            height = actress.height;
        }
        if(actress.listURL.digital){
            list_url = actress.listURL.digital;
        }

        //テンプレに挿入
        var object = {
            tmp_name: name,
//            tmp_image_url: imageURL,
            tmp_bust: bust,
            tmp_hip: hip,
            tmp_waist: waist,
            tmp_cup: cup,
            tmp_height: height,
            tmp_list_url: list_url
        }
        var html = jQuery.tmpl(heredoc, object);
        $('#products_list').append(html);

    });
}

//apiのurlを作成
function api_url_actress(api_id, affiliate_id, hits, page, bustsize){
    var offset = Number(page)*Number(hits) - Number(hits) + 1 ;
    var api_url =   "https://api.dmm.com/affiliate/v3/ActressSearch?api_id="+ api_id+
                    "&affiliate_id="+ affiliate_id+
                    "&bust="+ bustsize+ "-"+ bustsize+
                    "&hits="+ hits+
                    "&offset="+ offset+
                    "&output=json&callback=callback";
    return api_url;
}

//プログレスバーの表示切り替え
function show_loading(hidden){
    if(hidden){
        $("#progress_bar").show();
    }else{
        $("#progress_bar").hide();
    }
}
