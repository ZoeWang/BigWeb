/**
 * Created by caojiangtao on 16/2/26.
 */
var readyList;
isReady: false,
jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

        readyList = jQuery.Deferred();

        // Catch cases where $(document).ready() is called after the browser event has already occurred.
        // we once tried to use readyState "interactive" here, but it caused issues like the one
        // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            setTimeout( jQuery.ready, 0 );

            // Standards-based browsers support DOMContentLoaded
        } else if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", jQuery.ready, false );

            // If IE event model is used
        } else {
            // Ensure firing before onload, maybe late but safe also for iframes
            document.attachEvent( "onreadystatechange", DOMContentLoaded );

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", jQuery.ready );

            // If IE and not a frame
            // continually check to see if the document is ready
            var top = false;

            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {}

            if ( top && top.doScroll ) {
                (function doScrollCheck() {
                    if ( !jQuery.isReady ) {

                        try {
                            // Use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            top.doScroll("left");
                        } catch(e) {
                            return setTimeout( doScrollCheck, 50 );

                        }

                        // and execute any waiting functions
                        jQuery.ready();
                    }
                })();
            }
        }
    }
    return readyList.promise( obj );
};
//ready
ready: function( fn ) {
    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
}

//DOMContentLoaded
DOMContentLoaded = function() {
    if ( document.addEventListener ) {
        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        jQuery.ready();
    } else if ( document.readyState === "complete" ) {
        // we're here because readyState === "complete" in oldIE
        // which is good enough for us to call the dom ready!
        document.detachEvent( "onreadystatechange", DOMContentLoaded );
        jQuery.ready();
    }
}
