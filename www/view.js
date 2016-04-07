//classが指定していないボタンタグにデフォルトのクラスを指定する
$(function(){
    $("button").each(function(){
        if($(this).hasClass("")){
            $(this).addClass("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
        }
    });
});