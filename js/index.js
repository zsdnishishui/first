$(document).ready(function () {

    /**
    * TOC highlight with the corresponding content
    */
    function locateCatelogList() {
        /*获取文章目录集合,可通过：header过滤器*/
        var alis = $('article :header');
        /*获取侧边栏目录列表集合**/
        var sidebar_alis = $('.table-of-contents a').parent();
        /*获取滚动条到顶部的距离*/
        var scroll_height = $(window).scrollTop();
        for (var i = 0; i < alis.length; i++) {
            /*获取锚点集合中的元素分别到顶点的距离*/
            var a_height = $(alis[i]).offset().top - 100;
            if (a_height < scroll_height) {
                /*高亮显示*/
                $(sidebar_alis).removeClass('active');
                $(sidebar_alis[i]).addClass('active');
                a_height = $(".table-of-contents li.active").offset().top - $(".table-of-contents h2").offset().top
                var t_height = $(".table-of-contents li.active").offset().top-$(".table-of-contents li:first-child").offset().top
                if (a_height < 22) {
                    $(".table-of-contents").scrollTop(t_height-350);
                }
                if (a_height > 350) {
                    $(".table-of-contents").scrollTop(t_height-72);
                }
            }
        }
    }
    if($(".table-of-contents").length >0){
        $($('.table-of-contents a').parent()[0]).addClass('active');
        locateCatelogList();
        $(window).bind('scroll', locateCatelogList);
    }

});
