"use strict";

var getParameterByName = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

(function() {
  var app = document.querySelector("#app");
  app.addEventListener("dom-change", function() {
    console.log("Polymer Ready!");

    app.title = "Test Title";

    window.NOP_APP = app;

  });
})();