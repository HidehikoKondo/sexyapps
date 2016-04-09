//APIKEYなど
var API_ID = "NFcDM3yDYSkGmUt1B0tK";
var AFFILIATE_ID = "sexyapps-990";

//検索件数
var hits = 48;

function next_page(){
    //次のページ番号
    var next_page_no = Number($("#page_no").val())+1;

    //入力したバストサイズ
    var bustsize = $("#bustsize").val();
    request(next_page_no, bustsize);
}

function show_page(json){
    //ページ数更新、nextボタン処理。　合計人数と表示している人数
    var total = json.result.total_count;
    var current = Number(json.request.parameters.offset)+ Number(json.result.result_count) -1
    //合計人数に達したらボタンを無効にする
    if(total <= current){
        $("#next").prop("disabled", true);
    }
    $("#total").text(total);
    $("#current").text(current);
}

//データのリクエスト
function request(page, bustsize){
    //次へボタンを有効にする
    $("#next").prop("disabled", false);

    //現在のページを更新
    $("#page_no").val(page);

    //ローディング表示
    show_loading(true);
    var api_url = api_url_actress(API_ID, AFFILIATE_ID, hits, page, bustsize)

    $.ajax({
        type: 'GET',
        async: true,
        url: api_url,
        dataType: "jsonp",
        cache: false,
        success: function(json) {
            //商品一覧作成
            create_product_list(json);
            //ページ表示
            show_page(json);
        },
        error: function(json) {
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
    var actress_list = json.result.actress;
    $(actress_list).each(function(i){
        var actress = actress_list[i];

        //ヒアドキュメント
        var heredoc = (function () {/*
            <div class="mdl-cell mdl-cell--6-col-desktop mdl-cell-6-col-tablet mdl-cell--12-col-phone">
                <div class="card" style="background-image: url('${tmp_image_url}');">
                    <div class="card_title">
                        <div class="actress_name"><a href="${tmp_list_url}">${tmp_name}</a></div>
                    </div>
                    <div class="card_body">
                        <div class="card_div">
                            <div class="size_value">${tmp_bust}</div>
                            <div class="size_key">bust</div>
                        </div>
                        <div class="card_div">
                            <div class="size_value">${tmp_waist}</div>
                            <div class="size_key">waist</div>
                        </div>
                        <div class="card_div">
                            <div class="size_value">${tmp_hip}</div>
                            <div class="size_key">hip</div>
                        </div>

                        <div class="card_div">
                            <div class="size_value">${tmp_cup}</div>
                            <div class="size_key">cup</div>
                        </div>
                        <div class="card_div">
                            <div class="size_value">${tmp_height}</div>
                            <div class="size_key">height</div>
                        </div>
                    </div>
                </div>
            </div>
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

        //初期設定
        var imageURL = "noimage.png";
        var name = "-";
        var bust = "-";
        var hip = "-";
        var waist = "-";
        var cup = "-";
        var height = "-";
        var list_url = "http://www.sexyapps.download";

        //データを変数に設定
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
            tmp_image_url: imageURL,
            tmp_bust: bust,
            tmp_hip: hip,
            tmp_waist: waist,
            tmp_cup: cup,
            tmp_height: height,
            tmp_list_url: list_url
        }
        var html = jQuery.tmpl(heredoc, object);

        //商品欄に挿入
        $('#products_list').append(html);
    });
}

//apiのurlを作成
function api_url_actress(api_id, affiliate_id, hits, page, bustsize){
    var offset = Number(page)*Number(hits) - Number(hits) + 1;

    var bustsize_param = "";
    if(bustsize >= 120){
        //120以降全部対象にする
        bustsize_param = "120";
    }else if(bustsize <= 70){
        //70以下を全部対象
        bustsize_param = "-70";
    }else{
        //入力したサイズのみを対象
        bustsize_param = bustsize+ "-"+ bustsize;
    }

    var api_url =   "https://api.dmm.com/affiliate/v3/ActressSearch?api_id="+ api_id+
                    "&affiliate_id="+ affiliate_id+
                    "&bust="+ bustsize_param+
                    "&hits="+ hits+
                    "&offset="+ offset+
                    "&output=json&callback=callback";
    return api_url;
}

