"use strict";

// var getParameterByName = function(name) {
//   name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//   var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
//   var results = regex.exec(location.search);
//   return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// };

(function() {
  var app = document.querySelector("#app");

  var GALLERY_ITEMS = [
    {
      name: "Differential Gears",
      image: "http://lmv.rocks/gallery/thumbs/thumb_gears.jpg",
      url: "http://lmv.rocks/data/gears/output/bubble.json"
    },
    {
      name: "Lamborghini Aventador",
      image: "http://lmv.rocks/gallery/thumbs/thumb_aventador.jpg",
      url: "http://lmv.rocks/data/aventador/aventador.svf"
    },
    {
      name: "Engine",
      image: "http://lmv.rocks/gallery/thumbs/thumb_engine.jpg",
      url: "https://lmv.rocks/data/engineraw/0.svf"
    },
    {
      name: "Rally Fighter",
      image: "http://lmv.rocks/gallery/thumbs/thumb_rally.jpg",
      url: "http://lmv.rocks/data/rally/1/RallyFighter2.svf"
    },
    {
      name: "Race Car",
      image: "http://lmv.rocks/gallery/thumbs/thumb_racecar.jpg",
      url: "http://lmv.rocks/data/racecar/Design.svf"
    },
    // {
    //   name: "Mountain Bike",
    //   image: "http://lmv.rocks/gallery/thumbs/thumb_bike.jpg",
    //   url: "https://lmv.rocks/data/bike/0.svf"
    // },
    {
      name: "TVR Engine",
      image: "http://lmv.rocks/gallery/thumbs/thumb_v8.jpg",
      url: "http://lmv.rocks/data/engine2L/Design.svf"
    },
    {
      name: "Trench Digger",
      image: "http://lmv.rocks/gallery/thumbs/thumb_tractor.jpg",
      url: "http://lmv.rocks/data/tractor4/0.svf"
    },
    {
      name: "Residential Exterior",
      image: "http://lmv.rocks/gallery/thumbs/thumb_resext.jpg",
      url: "http://lmv.rocks/data/house/Residential Exterior.obj.svf"
    },
    {
      name: "House",
      image: "http://lmv.rocks/gallery/thumbs/thumb_house.jpg",
      url: "http://lmv.rocks/data/house2/0.svf"
    },
  ];

  // convert GALLERY_ITEMS into usable triplets
  (function() {
    app.galleryItems = [];
    var currTripletIdx = -1;
    for (var i=0; i<GALLERY_ITEMS.length; i++) {
      if (i%3===0) {
        app.galleryItems.push([]);
        currTripletIdx++;
      }
      GALLERY_ITEMS[i].style = "background-image: url("+GALLERY_ITEMS[i].image+")";
      app.galleryItems[currTripletIdx].push(GALLERY_ITEMS[i]);
    }
  })();

  app.title = "LMV Rocks";

  window.NOP_APP = app;
  app.addEventListener("dom-change", function() {
    console.log("Polymer Ready!");

    var viewerElem = document.querySelector("#viewer");
    var viewer = viewerElem.viewer;

    var avp = Autodesk.Viewing.Private;
    var envs = [];
    for (var i=0; i<avp.LightPresets.length; i++) {
      envs.push({
        value: i, label: avp.LightPresets[i].name
      });
    }
    app.envs = envs;  // need to set it after, to trigger data binding

    function firstLoad() {
      viewer.setLightPreset(10);
      var camera = viewer.getCamera();

      function firstLoadFinish() {
        setTimeout(function() {
          viewer.navigation.setRequestTransition(
            true,
            new THREE.Vector3(31850.135461880633, 16703.458680557833, -36369.33929266341),
            camera.target,
            camera.fov,
            false
          );
        }, 1000);
        viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, firstLoadFinish);
      }
      viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, firstLoadFinish);

      viewer.removeEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, firstLoad);
    }
    viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, firstLoad);

    app.viewerExpand = function() {
      document.getElementById("viewermenu").classList.toggle("viewer-expanded");
      viewerElem.classList.toggle("viewer-expanded");
      viewer.resize();

      app.toolbarClick();
    };

    app.gallerySelect = function() {
      viewerElem.setAttribute("url", this.url);
    };

    app.galleryLaunch = function(event) {
      window.open("http://lmv.rocks/viewer/?url=" + this.url);
      event.stopPropagation();
    };

    app.toolbarClick = function() {
      var cmd = this.getAttribute("cmd");
      var viewerMenu = document.querySelector("#viewermenu");

      Array.prototype.forEach.call(viewerMenu.querySelectorAll(".panel"), function(elem) {
        if (elem.classList.contains(cmd)) {
          return;
        }
        elem.classList.remove("show");
        setTimeout(function() {
          elem.classList.add("dnone");  // TODO: this is bad!
        }, 500);
      });
      var panel = viewerMenu.querySelector(".panel."+cmd);
      if (panel) {
        if (panel.classList.contains("show")) {
          panel.classList.remove("show");
          setTimeout(function() {
            panel.classList.add("dnone");   // TODO: this is bad!
          }, 500);
        }
        else {
          panel.classList.add("show");
          panel.classList.remove("dnone");
        }


      }
    };

    app.setExplode = function(value) {
      if (this.explodeValue === value)
        return;
      this.explodeValue = value;
      viewer.explode(value/100);
    };

    app.setShadows = function() {
      viewer.setGroundShadow(this.checked);
    };

    app.setReflections = function() {
      viewer.setGroundReflection(this.checked);
    };

    app.setLighting = function() {
      viewer.setLightPreset(this.value);
      app.toolbarClick();
    };

    var explodeSlider = document.querySelector(".panel.explode > paper-slider");
    explodeSlider.addEventListener(
      "immediate-value-change",
      function() {
        app.setExplode(this.immediateValue);
      }
    );
    explodeSlider.addEventListener(
      "value-change",
      function() {
        app.setExplode(this.value);
      }
    );

  });
})();