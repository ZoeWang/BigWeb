//////////////////////////////////////////////
// 这个文件是 途牛无线Wap项目的一部分
// Copyright (c) 2014 Tuniu
//////////////////////////////////////////////
/**
 * 功能说明：微信分享公用控件
 * @author:  殷倩 yinqian (yinqian@tuniu.com)
 * @version: wx-share.js 2014-03-27 10:00:35
 */

(function(window, document) {
    function htmlDecode(html) {
        return html.replace(/&#39;/g, "'").replace(/<br\s*(\/)?\s*>/g, "\n").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    }

    var callFunc = function(fn, result, typeName, obj) {
        if (typeof(fn) === 'function') {
            fn(result, typeName, obj);
        }
    };

    var wxShare = function(options, getDataFn) {
        var opts = {
            // beforeShare&success用法 functioni(result, type, typeName) {} 0:false 1:sendAppMessage 2:shareTimeline 3:shareWeibo 4:shareFB 5:general
            "beforeShare": options.beforeShare || false,
            "success": options.success || false
        };
        var getData = function(userData) {
            var userData = userData || {};
            var option = getDataFn() || {};
            var opt = {
                "appid": userData.appid || option.appid || 'wx0660297a1ddb8071',
                "img_url": userData.img_url || option.img_url || '',
                "link": userData.link || option.link || window.location.href,
                "title": userData.title || option.title || '途牛旅游网',
                "desc": userData.desc || option.desc || '途牛旅游网'
            };
            var data = {
                "appid": opt.appid,
                "img_url": opt.img_url,
                "link": opt.link,
                "title": htmlDecode(opt.title),
                "desc": htmlDecode(opt.desc),
                "img_width": "640",
                "img_height": "640"
            };
            return data;
        };

        var onBridgeReady = function() {
            try {
                // 显示分享按钮
                WeixinJSBridge.call('showOptionMenu');
                WeixinJSBridge.call('hideToolbar');
                // 分享給好友
                WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                    var dataForWeixin = getData(opts.beforeShare('sendAppMessage', dataForWeixin));
                    WeixinJSBridge.invoke('sendAppMessage', dataForWeixin, function(res) {
                        callFunc(opts.complete, res, 'sendAppMessage', dataForWeixin);
                        if ((/:ok$/.test(res.err_msg) || /:confirm$/.test(res.err_msg))) {
                            callFunc(opts.success, res, 'sendAppMessage', dataForWeixin);
                        }
                    });
                });
                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function(argv) {
                    var dataForWeixin = getData(opts.beforeShare('shareTimeline', dataForWeixin));
                    WeixinJSBridge.invoke('shareTimeline', dataForWeixin, function(res) {
                        callFunc(opts.complete, res, 'sendAppMessage', dataForWeixin);
                        if ((/:ok$/.test(res.err_msg) || /:confirm$/.test(res.err_msg))) {
                            callFunc(opts.success, res, 'shareTimeline', dataForWeixin);
                        }
                    });
                });
                // 分享到腾讯微博
                WeixinJSBridge.on('menu:share:weibo', function(argv) {
                    var dataForWeixin = getData(opts.beforeShare('shareWeibo', dataForWeixin));
                    WeixinJSBridge.invoke('shareWeibo', dataForWeixin, function(res) {
                        callFunc(opts.complete, res, 'sendAppMessage', dataForWeixin);
                        if ((/:ok$/.test(res.err_msg) || /:confirm$/.test(res.err_msg))) {
                            callFunc(opts.success, res, 'shareWeibo', dataForWeixin);
                        }
                    });
                });
            } catch (e) {
                alert(e.message);
            }
        };

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", onBridgeReady, !1);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
        } else {
            onBridgeReady()
        }
    };

    // 执行wxshare
    if (document.getElementById('shareArea')) {
        wxShare({
            "beforeShare": function(typeName, dataForWeixin) {
                if (typeof(window.wxBeforeShare) === 'function') {
                    return window.wxBeforeShare(typeName, dataForWeixin);
                }
                return false;
            },
            "success": function(result, typeName, opt) {
                if (typeof(window.wxSuccess) === 'function') {
                    return window.wxSuccess(result, typeName, opt);
                }
                return false;
            }
        }, function() {
            return {
                "title": document.getElementById('shareTitle').value,
                "desc": document.getElementById('shareDesc').value,
                "link": document.getElementById('shareLink').value,
                "img_url": document.getElementById('shareImg').getAttribute('src'),
            }
        });
    }

})(window, document);