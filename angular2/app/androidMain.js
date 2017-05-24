(function(app) {
  document.addEventListener('DOMContentLoaded', function() {

    ng.platform.browser.bootstrap(app.AndroidComponent);

  });
})(window.app || (window.app = {}));