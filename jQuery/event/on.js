jQuery.fn.on = function( types, selector, data, fn, /*INTERNAL*/ one ) {
    var origFn, type;

    // types可以是一个由types/handlers组成的map对象
    if ( typeof types === "object" ) {
        // 如果selector不是字符串
        // 则将传参由( types-Object, selector, data )变成( types-Object, data )
        if ( typeof selector !== "string" ) {
            data = data || selector;
            selector = undefined;
        }
        //遍历所有type
        for ( type in types ) {
            //添加type事件处理函数
            this.on( type, selector, data, types[ type ], one );
        }
        return this;
    }

    // 如果data为空，且fn为空
    if ( data == null && fn == null ) {
        // 则传参由( types, selector )变成( types, fn )
        fn = selector;
        data = selector = undefined;
        // 否则如果只是fn为空
    } else if ( fn == null ) {
        // 如果selector为字符串
        if ( typeof selector === "string" ) {
            // 则传参从( types, selector, data )变成( types, selector, fn )
            fn = data;
            data = undefined;
        } else {
            // 否则传参从( type, selector, data )变成( types, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
        }
    }

    //……弄了半天其实就是在模拟重载而已……囧rz

    if ( fn === false ) {
        //如果fn为false则变成一个return false的函数
        fn = returnFalse;
    } else if ( !fn ) {
        //如果fn现在还不存在，则直接return this
        return this;
    }

    // 如果one为1
    if ( one === 1 ) {
        // 保存fn
        origFn = fn;
        // 重新定义fn
        fn = function( event ) {
            // 这个事件只用一次，用完就用off取消掉。
            jQuery().off( event );
            return origFn.apply( this, arguments );
        }
        // 使用相同的ID，为了未来好删除事件
        fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    // 对所有用jQuery.event.add来添加
    return this.each( function() {
        jQuery.event.add( this, types, fn, data, selector );
    });
};








jQuery.event.add = function( elem, types, handler, data, selector ) {

    var handleObjIn, eventHandle, tmp,
        events, t, handleObj,
        special, handlers, type, namespaces, origType,
    // 通过内部缓存获取元素数据
    // 涉及到jQuery的另外一个大的方面：缓存机制。或许我应该先看缓存机制的。。。
        elemData = jQuery._data( elem );

    // 不会没有数据或者text、comment节点添加事件
    if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
        return;
    }


    // 如果handler是个包含handler和selector的对象
    //这里的handler 可以是一个function,即我们平时所说的绑定的事件方法
    //同时也可以是一个事件对象，也就是下面所说的handleObj,那么如果是在jQuery的内部是可以传递一个事件对象过来的
    if ( handler.handler ) {
        // 则定位必要的参数
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
    }

    // 如果handler没有ID，则给个ID给他
    // 用于未来寻找或者删除handler
      // 这里分配guid
    if ( !handler.guid ) {
        handler.guid = jQuery.guid++;
    }

    // 如果缓存数据中没有events数据

    if ( !(events = elemData.events) ) {
        // 则初始化events
        events = elemData.events = {};
    }
    // 如果缓存数据中没有handle数据
    if ( !(eventHandle = elemData.handle) ) {
        // 定义事件处理函数
        eventHandle = elemData.handle = function( e ) {
            // 取消jQuery.event.trigger第二次触发事件
            // 以及装卸后的事件
            return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                undefined;
        };
        // 定义事件处理器对应的元素，用于防止IE非原生事件中的内存泄露
        eventHandle.elem = elem;
    }

    // 事件可能是通过空格键分隔的字符串，所以将其变成字符串数组
    types = ( types || "" ).match( core_rnotwhite ) || [""];
    // 事件的长度
    t = types.length;
    // 遍历所有事件
    while ( t-- ) {
        // 尝试取出事件的namespace，如aaa.bbb.ccc
        tmp = rtypenamespace.exec( types[t] ) || [];
        // 取出事件，如aaa
        type = origType = tmp[1];
        // 取出事件命名空间，如bbb.ccc，并根据"."分隔成数组
        namespaces = ( tmp[2] || "" ).split( "." ).sort();

        // 事件是否会改变当前状态，如果会则使用特殊事件
        special = jQuery.event.special[ type ] || {};

        // 根据是否已定义selector，决定使用哪个特殊事件api，如果没有非特殊事件，则用type
        type = ( selector ? special.delegateType : special.bindType ) || type;

        // 更具状态改变后的特殊事件
        special = jQuery.event.special[ type ] || {};

        // 组装用于特殊事件处理的对象
        handleObj = jQuery.extend({
            type: type,
            origType: origType,
            data: data,
            handler: handler,
            guid: handler.guid,
            selector: selector,
            needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
            namespace: namespaces.join(".")
        }, handleObjIn );

        // 初始化事件处理列队，如果是第一次使用
        if ( !(handlers = events[ type ]) ) {
            handlers = events[ type ] = [];
            handlers.delegateCount = 0;

            // 如果获取特殊事件监听方法失败，则使用addEventListener进行添加事件，和attachEvent说88了
            if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                if ( elem.addEventListener ) {
                    elem.addEventListener( type, eventHandle, false );
                }
            }
        }

        // 通过特殊事件add处理事件
        if ( special.add ) {
            // 添加事件
            special.add.call( elem, handleObj );

            // 设置处理函数的ID
            if ( !handleObj.handler.guid ) {
                handleObj.handler.guid = handler.guid;
            }
        }

        // 将事件处理函数推入处理列表
        if ( selector ) {
            handlers.splice( handlers.delegateCount++, 0, handleObj );
        } else {
            handlers.push( handleObj );
        }

        // 表示事件曾经使用过，用于事件优化
        jQuery.event.global[ type ] = true;
    }

    // 设置为null避免IE中循环引用导致的内存泄露
    elem = null;
};
