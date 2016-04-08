$(function(){
    //ローディング隠す
    $("#progress_bar").hide();

    //スライダーの初期位置
    $("#bust_slider").val($("#bustsize").val())

    //クラス未設定のボタンに共通のcssクラスを適用
    $("button").each(function(){
        if($(this).hasClass("")){
            $(this).addClass("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
        }
    });
});

//スライダー
function change_slider(){
    $("#bustsize").val($("#bust_slider").val());
    change_bustsize();
}

//バストサイズの入力form
function change_bustsize(){
    bustsize = $("#bustsize").val();
    $("#bust_slider").val(bustsize);
    clear_page();
    request(1, bustsize);
}

//商品一覧を消す
function clear_page(){
    $('#products_list').text("");
}

//プログレスバーの表示切り替え
function show_loading(hidden){
    if(hidden){
        $("#progress_bar").show();
    }else{
        $("#progress_bar").hide();
    }
}
