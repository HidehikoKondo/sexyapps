$(function(){
    //ローディング隠す
    $("#progress_bar").hide();

    //クラス未設定のボタンに共通のcssクラスを適用
    $("button").each(function(){
        if($(this).hasClass("")){
            $(this).addClass("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
        }
    });
});

//スライダー
function change_slider(){
    console.log($("#bust_slider").val());
    $("#bustsize").val($("#bust_slider").val());
    change_bustsize();
}

//バストサイズの入力form
function change_bustsize(){
    bustsize = $("#bustsize").val();
    clear_page();
    request(1, bustsize);
}

//商品一覧を消す
function clear_page(){
    $('#products_list').text("");
}
