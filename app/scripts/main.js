"use strict";

var getParameterByName = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

(function() {
  var app = document.querySelector("#app");

  window.NOP_APP = app;
  app.addEventListener("dom-change", function() {
    console.log("Polymer Ready!");

    var viewerElem = document.querySelector("#viewer");
    var viewer = viewerElem.viewer;

    app.title = "Test Title";

    app.pageSelected = 0;

    app.viewerExpand = function() {
      document.querySelector(".section-hero").classList.toggle("viewer-expanded");
      viewer.resize();
    };


  });
})();