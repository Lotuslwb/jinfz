require(['jquery','global','timer','easing'], function ($,global,Timer,undefined) {

    // 信托、资管、有限合伙切换
    $("#3F .floor_tab .tab_control").on("click", "li.tab_control_item", function() {
        var that = $(this),
            index = that.index();
        tab_hd = that.parents("div.tab_hd"),
            tab_bd = tab_hd.next();
        that.addClass("tab_item_active").siblings().removeClass("tab_item_active");
        tab_hd.find("a.more_link").hide().eq(index).show();
        tab_bd.find("div.tab_con").removeClass("tab_con_active").eq(index).addClass("tab_con_active");

        // bookmark
        $("#3F").find("div.floor_left").hide().eq(index).show();
    });

    // timeline
    $.get('/public/home/part6FTimeline', {}, function(data) {
        if (data && (data['status'] == 0) && data['timeline']) {
            var html = '<ul class="feed_list">';
            var timeline = data['timeline'];
            for (var i = 0, len = timeline.length; i < len; i++) {
                var record = timeline[i];
                html += '<li>'
                + '<span class="feed_time">' + record["time"] + '前</span>'
                + '<a class="feed_name" target="_blank" href="' + record["user"]["home"] + '">' + global.cutstr(record["user"]["name"],4) + '</a>'
                + '<span class="feed_active">回答了问题</span>'
                + '<a class="feed_q" target="_blank" title="' + record["question"]["title"] + '" href="' + record["question"]["url"] + '">' + global.cutstr(record["question"]["title"],20) + '</a>'
                + '</li>';
            }
            html += '</ul>';
            $("#timeline").html(html);


            if (9 > $("#timeline").find("ul.feed_list li").length) return false;

            var records = $("#timeline").find("ul.feed_list");
            var itemHeight = records.find("li:first").height();
            var timer = new Timer(null, function() {
                records.animate({"marginTop": (-itemHeight)+"px"}, 500, function() {
                    records.find("li:first").appendTo(records);
                    records.css("marginTop", "0");
                });
            }, 2000);
            timer.start(2000);
            $("#timeline").on("mousemove", "ul.feed_list li", function() {
                timer.stop();
            }).mouseout(function() {
                timer.start(2000);
            });

            //截取字符串功能gloabl.cutstr
        }
    }, 'json');



    // SEO
    $("div.fastlink_item a.more").click(function() {
        var that = $(this),
            fastlink_bd = $(this).parents("div.fastlink_hd").next();
        if (that.html() == '[展开]') {
            that.html('[收起]');
            fastlink_bd.find("ul.link_list").css({height: 'auto'});
        } else {
            that.html('[展开]');
            fastlink_bd.find("ul.link_list").css({height: '40px'});
        }
    });

    // search
    var amountFirst = timeFirst = 1;
    $("#amount, #time").focus(function() {
        var id = $(this).attr('id');
        if ('不限' == $(this).val().replace(/(^\s*)|(\s*$)/g, '') || (id == 'amount' && amountFirst == 1) || (id == 'time' && timeFirst == 1)) {
            $(this).val('');
            if (id == 'amount')
                amountFirst = 0;
            else if (id == 'time')
                timeFirst = 0;
        }
    }).blur(function() {
        if (!$(this).val().replace(/(^\s*)|(\s*$)/g, '')) {
            $(this).val("不限");
        }
    });


    // leftscroll show
    var _h = $(window).height();
    var _w = $(window).width();
    if (_w < 1440) {
        $("#leftScroll").hide();
    }
    $(window).resize(function(event) {
        var _w = $(window).width();
        if (_w < 1440) {
            $("#leftScroll").hide();
        }else{
            $("#leftScroll").show();
        }
    });

    $(window).scroll(function(){

        var _flag_1 = true;

        var _scrollTop = $(window).scrollTop();

        if (_scrollTop < 499) {
            $("#leftScroll").stop().animate({
                top: '-560px'
            },500);
        } else if (_scrollTop > 499 && _flag_1) {
            _flag_1 = false;
            $("#leftScroll").stop().animate({
                top: '200px'               
            },800);
        }

        var offsets = [],
            targets = [],
            scrollHeight = $(window)[0].scrollHeight || Math.max($('body')[0].scrollHeight, document.documentElement.scrollHeight);

        $('body')
            .find('#leftScroll ul.scroll_floor_list li > a')
            .map(function () {
                var $el   = $(this);
                var href  = $el.attr('data-floor');
                var $href = $('#'+href);

                return ($href
                && $href.length
                && $href.is(':visible')
                && [[$href['offset']().top, href]]) || null;
            })
            .sort(function (a, b) { return a[0] - b[0] })
            .each(function () {
                offsets.push(this[0])
                targets.push(this[1])
            });

        var scrollTop = $(window).scrollTop();
        var maxScroll = scrollHeight - $(window).height()
        var i

        if (scrollTop >= maxScroll) {
            i = targets[targets.length - 1];
            return activate(i)
        }

        if (scrollTop <= offsets[0]) {
            i = targets[0]
            return activate(i)
        }

        for (i = offsets.length; i--;) {
            scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop < offsets[i + 1])
            && activate(targets[i])
        }
    });

    function activate(target) {
        $('#leftScroll ul.scroll_floor_list li > a')
            .parentsUntil('#leftScroll', '.active')
            .removeClass('active');
        $('#leftScroll ul.scroll_floor_list li > a'+'[data-floor="' + target + '"]')
            .parents('li')
            .addClass('active');
    }

    $("#leftScroll .floor_item a").click(function(event) {
        var $this = $(this);
        var $parent = $this.parent();
        var _id = $(this).attr('data-floor');
        if ($this.hasClass('floor_totop')) {
            $('body,html').animate({scrollTop:0},1000);
        }
        if (_id) {
            var _top = $("#"+_id).offset().top;
            $("body,html").animate({scrollTop:_top},1000);
            $parent.addClass("active").siblings().removeClass("active");
        }
    });

    $(".idx_calc").delay(500).animate({top: '70px'},1000,'easeOutBack');

});