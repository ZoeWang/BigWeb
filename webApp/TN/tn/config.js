seajs.config({
    base: "/site/js/sea-modules/",
    alias: {
        // sea-modules
        "zepto": "zepto/zepto.js",
        "manager":"manager/manager.js",
        "cookie": "cookie/cookie.js",
        "dialog": "dialog/dialog.js",
        "dialog30": "dialog30/dialog.js",
        "base-info": "base-info/base-info.js",
        "search-bar": "search-bar/search-bar.js",
        "tooltip": "tooltip/tooltip.js",
        "spinner": "spinner/spinner.js",
        "moment": "moment/moment.js",
        "calendar": "calendar/calendar.js",
        "calendar30": "calendar/calendar30.js",
        "input-focus": "input-focus/input-focus.js",
        "wx-share": "wx-share/wx-share.js",
        "download-open": "download-open/download-open.js",
        "map": "map/map.js",
        "template": "template/template.js",
        // special business-modules
        "do-error-action": "/site/js/business-modules/grab-cruise/do-error-action.js",
        "verify-set":'set/verify-set.js',
        "touch-slider":'slider/touch-slider.js',
        "responsive-image":"responsive-image/responsive-image.js",
        "iscroll":"iscroll/iscroll.js",
        "channel-responsive":"responsive/channel.js",
        "pagenation":"pagenation/pagenation.js",
        "filter-bar":"filter-bar/filter-bar.js",
        "pjax":"pjax/zepto.pjax.js",
        "waves": "waves/waves",
        "choosenum": "choosenum/choosenum",
        "clips": "clips/clips.js",
        "address": "address/address.js",
        "event-common": "event/common-function.js",
        "stat":"event/stat.js",
        "servertime":"event/servertime.js",
        "swipe":"event/swipe.min.js",
        "phaser":"phaser/phaser.min.js",
        "pixi":"pixi/pixi.min.js",
        "full-page":"full-page/full-page.min.js",
        // 业务级
        // 产品详情页各模块
        "product-baseinfo":"/site/js/business-modules/product30/base-info.js",
        "product-journeydetail":"/site/js/business-modules/product30/journey-detail.js",
        "product-departureInfo":"/site/js/business-modules/product30/departure-info.js",
    }
    // ,
    // map:[
    //     ['http://*.tuniu.com/site/js/','http://img4.tuniucdn.com/w/j/201405152/']
    // ]
});