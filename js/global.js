/**
 * Created by Administrator on 2014/9/19.
 */
define(['jquery','cookie'],function($,undefined){
    var global = {};
    /*字符串截取功能*/
    var Cutstr = function(str, len) {
        return (str.length <= len) ? str : str.substring(0,len)+"...";
    };

    /**
     * 身份号码格式验证
     * source from formValidator
     * @param sId string ID NO.
     * @returns Boolean true if check pass or string the error message
     */
    global.isCardId = function(sId) {
        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
        var iSum=0 ;
        var info="" ;
        if(!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
        sId=sId.replace(/x$/i,"a");
        if(aCity[parseInt(sId.substr(0,2))]==null) return "你的身份证地区非法";
        sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/")) ;
        if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return "身份证上的出生日期非法";
        for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
        if(iSum%11!=1) return "你输入的身份证号非法";
        return true;
    }
    global.cutstr = Cutstr;

    /*passport帐号中心地址配置*/
    global.PASSPORT = 'passport.jinfuzi.com'
    /*common script*/
    // 顶部通栏
    $("#head-da .da_colse").click(function(){
        $("#head-da").hide();
        var now = new Date();
        now.setHours(now.getHours()+24);
        $.cookie("_hide_head_da", 1, {expires: now, path: '/'});
    });
    
    // 底部通栏
    $.cookie("_hide_promotion_da") || $("#mod-promotion").show();
    $("#mod-promotion .mod_promotion_exit").click(function(){
    	$("#mod-promotion").hide();
        var now = new Date();
        now.setHours(now.getHours()+24);
        $.cookie("_hide_promotion_da", 1, {expires: now, path: '/'});
    });
    
    // 登录状态区
    $.getJSON('https://' + global.PASSPORT + '/passport/user/loginStatus?cb=?', function (data) {
        if (data[0] == 10000) {
            $.getJSON('/public/login/index?authToken=' + data[2]['authToken'], function (data) {
                if (data[0] == 10000) {
                    $('.login-off').hide();
                    $('.login-on').show();
                    $('.login-on').find(".user_name").text(data[2]['nickname']);
                }
            })
        } else {
            $('.login-off').show();
            $('.login-on').hide();
        }
    });
    
    var user_center_timer = null;

    $(".user_center").hover(function(e){
        var that = $(this);
        clearTimeout(user_center_timer);
        user_center_timer = setTimeout(function(){
            that.addClass('uc_active').find('.uc_bd').show();
            that.find('.arrow').addClass('arrow_up').removeClass('arrow_down');
        },200);
       
    },function(e){
         clearTimeout(user_center_timer);
        $(this).removeClass('uc_active').find('.uc_bd').hide();
        $(this).find('.arrow').removeClass('arrow_up').addClass('arrow_down');
    });

    // 搜索模拟下拉框
    var timer = null;
    $(".search_select").hover(function() {
        clearTimeout(timer);
        $(this).addClass('active').find('.select_bd').stop().slideDown('fast');
    }, function() {
        var that = $(this);
        clearTimeout(timer);
        timer = setTimeout(function() { that.removeClass('active').find('.select_bd').stop().slideUp('fast'); }, 100);
    });

    // banner轮播
    var _eq = $(".banner_control .item").length;
    var _count = 0;
    var _time = 5000;
    var cban = function(i){
        $(".banner_item").eq(i).fadeIn("slow").siblings().fadeOut('slow');
        $(".banner_control .item").eq(i).addClass('active').siblings().removeClass('active');
    }

    var fun = function(){
        cban(_count);
        _count >=_eq-1 ? _count =0: _count++;
    }
    fun();
    var _t = setInterval(fun,_time);
    var _flag = true;

    $(".banner_control .item").click(function() {
        // clearInterval(_t);
        _count = $(this).index();
        fun();
        // _t = setInterval(fun,_time);
    });

    $('.banner_control_2 .pre').click(function(){
        // clearInterval(_t);
        _count = $('.banner_control li.active').index();

        if(_count == 0){
            _count = _eq - 1;
        }else{
            _count--;
        }
        fun();
        // _t = setInterval(fun,_time);
    });

    $('.banner_control_2 .next').click(function(){
        // clearInterval(_t);
        _count = $('.banner_control li.active').index();

        if(_count == _eq - 1){
            _count = 0;
        }else{
            _count++;
        }
        fun();
        // _t = setInterval(fun,_time);
    });

    $(".mod_banner").hover(function() {
        if (_flag) {
            _flag = false;
            clearInterval(_t);
        };
    }, function() {
        if (!_flag) {
            _flag = true;
            _t = setInterval(fun,_time);
        };
    });
    // 底部友链
    var ft_more_flag = false;
    var $ft_list = $(".mod_footer .links_wrap a");
    $ft_list.eq(20).nextAll().hide();

    $("#ft_more_btn").click(function(event) {
        if (!ft_more_flag) {
            $ft_list.show();
            $(this).text('[收起]');
            ft_more_flag = true;
        }else{
            $ft_list.eq(20).nextAll().hide();
            $(this).text("[展开]");
            ft_more_flag = false;
        }
    });

    var url = ['/xtnew/xtprd/index', '/zgnew/zgprd/index', /*'/yxhh/list/search',*/ '/simunew/simusearch/index', '/bankpro/list/index', '/sns/question/search'];
    $("#head-search-from .select_bd").on("click", "ul.select_list li", function() {
        var that = $(this),
            index = $(this).index(),
            searchForm = $("#head-search-from");

        searchForm.find("div.select_hd span.txt").html(that.html());
        searchForm.attr("action", url[index]);
        searchForm.find("div.select_bd").hide();
        searchForm.find("div.search_select").removeClass("active");
    });

    function throttle(callback, context) {
        clearTimeout(callback.tId);
        callback.tId = setTimeout(function() { callback.call(context) }, 100);
    }
    
    //底部悬浮
    var toggleFt = function(argu_define){
        var argu = {
            ft_flag : false,//是否一屏后显示，默认为否
            ft_wrap : "mod_book_fixed",
            ft_btn  : "btn",
            ft_bd   : "book_bd"//显示或隐藏的内容
            
        };
        if(argu_define){
            argu = $.extend( argu, argu_define);
        }
        var ft_wrap_obj = $("."+argu.ft_wrap);
        if(argu.ft_flag){
            $(window).scroll(function(event) {
                var h_scroll = $(this).scrollTop();
                if(h_scroll >= $(window).height()){
                    ft_wrap_obj.show();
                }else{
                    ft_wrap_obj.hide();
                }
            }); 
        }else{
            ft_wrap_obj.show();
        }
        $(ft_wrap_obj).find('.btn').click(function(event) {
            var idx = $(this).index();
            var ft_bd_obj = ft_wrap_obj.find("."+argu.ft_bd);
            $(this).hide().siblings("."+argu.ft_btn).show();
            ft_bd_obj.eq(idx).hide().siblings("."+argu.ft_bd).show();
        });
        
    }
    global.toggleFt = toggleFt;
   
    // This adds 'placeholder' to the items listed in the jQuery .support object.
    $(function() {
        jQuery.support.placeholder = false;
        test = document.createElement('input');
        if('placeholder' in test) jQuery.support.placeholder = true;
    });

    // This adds placeholder support to browsers that wouldn't otherwise support it.
    $(function() {
        if(!$.support.placeholder) {
            var active = document.activeElement;
            $(':text').focus(function () {
                if (!!$(this).attr('placeholder') && $(this).val() == $(this).attr('placeholder')) {
                    $(this).val('').removeClass('no-placeholder');
                    !!$(this).attr('default-color') && $(this).css({'color': $(this).attr('default-color')});
                }
            }).blur(function () {
                if (!!$(this).attr('placeholder') && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
                    $(this).val($(this).attr('placeholder')).addClass('no-placeholder');
                    $(this).attr('default-color', $(this).css('color')).css({'color': '#ccc'});
                }
            });
            $(':text').blur();
            $(active).focus();
            $('form').submit(function () {
                $(':text.no-placeholder').val('');
            });
        }
    });
    /*common script*/
    return global;
});