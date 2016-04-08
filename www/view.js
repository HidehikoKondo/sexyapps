$(function(){
    //ローディング隠す
    $("#progress_bar").hide();

    //ボタンのクラス適用
    $("button").each(function(){
        if($(this).hasClass("")){
            $(this).addClass("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
        }
    });
});