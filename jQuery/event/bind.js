bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
},
unbind: function( types, fn ) {
    return this.off( types, null, fn );
},

one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
},

delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
},
undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
}
