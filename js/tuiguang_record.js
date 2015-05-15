require(['jquery'],function($,undefined){
    //广告点击数统计
    $(document).on('click','.JadsZoneDisplay',function(){
        var id = $(this).attr('data-id'),
            updated = $(this).attr('data-updated');
        $.post("/statistics/adsClick", { id: id, updated: updated });
    });
});