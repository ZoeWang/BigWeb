/**
 * http://www.zhangxinxu.com/wordpress/2013/04/qunit-javascript-unit-test-%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/
 */

function format(string, values) {
    for (var key in values) {
        string = string.replace(new RegExp("\{" + key + "}","g"), values[key]);
    }
    return string;
}
 
test("basics", function() {
    var values = {
        name: "World"
    };
    equal( format("Hello, {name}", values), "Hello, World", "单个匹配" );
    equal( format("Hello, {name}, how is {name} today?", values),
        "Hello, World, how is World today?", "多个匹配" );
});

// var Money = function(options) {
//     this.amount = options.amount || 0;
//     this.template = options.template || "{symbol}{amount}";
//     this.symbol = options.symbol || "$";
// };
// Money.prototype = {
//     add: function(toAdd) {
//         this.amount += toAdd;
//     },
//     toString: function() {
//         return this.template
//             .replace("{symbol}", this.symbol)
//             .replace("{amount}", this.amount)
//     }
// };
// Money.euro = function(amount) {
//     return new Money({
//         amount: amount,
//         template: "{amount} {symbol}",
//         symbol: "EUR"
//     });
// };

// module("Money", {
//     setup: function() {
//         this.dollar = new Money({
//             amount: 15.5
//         });
//         this.euro = Money.euro(14.5);
//     },
//     teardown: function() {
//         // 可以使用this.dollar和this.euro作清除
//     }
// });
 
// test("add", function() {
//     equal( this.dollar.amount, 15.5 );
//     this.dollar.add(16.1)
//     equal( this.dollar.amount, 31.6 );
// });
// test("toString", function() {
//     equal( this.dollar.toString(), "$15.5" );
//     equal( this.euro.toString(), "14.5 EUR" );
// });

// // 异步测试代码
// test("async", function() {
//     stop();
//     $.getJSON("resource", function(result) {
//         deepEqual(result, {
//             status: "ok"
//         });
//         start();
//     });
// });