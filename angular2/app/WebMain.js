(function(app) {
  document.addEventListener('DOMContentLoaded', function() {

    ng.platform.browser.bootstrap(app.WebComponent);

  });
})(window.app || (window.app = {}));