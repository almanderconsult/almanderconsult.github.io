      var default_page = "home";
      var default_position = new google.maps.LatLng(40.0, -10.0);
      var contact_position = new google.maps.LatLng(58.4, 12.5);
      var contact_marker_position = new google.maps.LatLng(58.35, 11.94);
      var bvessel_position = new google.maps.LatLng(65.15, -21.92);
      var gvessel_position = new google.maps.LatLng(10.0, -100.0);
      var lbvessel_position = new google.maps.LatLng(38.78, -8.92);

      var map = null;
      var infoBubble = null;
      var marker = null;

      var bvesselMarker = null;
      var gvesselMarker = null;
      var lbvesselMarker = null;

      var services_active = false;
      var bubbleCounter = 0;

      var bubbles = null;
      var bvesselBubble = null;
      var gvesselBubble = null;
      var lbvesselBubble = null;


      var gpoints = [
        new google.maps.LatLng(10.0, -100.0),
        new google.maps.LatLng(7.0, -90.0),
        new google.maps.LatLng(6.5, -79.66),
        new google.maps.LatLng(8.93, -79.5),
        new google.maps.LatLng(9.35, -80.0),
        new google.maps.LatLng(22.5, -85.4),
        new google.maps.LatLng(25.0, -80.0),
        new google.maps.LatLng(25.66, -80.2),
        new google.maps.LatLng(20.3, -74.0),
        new google.maps.LatLng(9.35, -80.0),
        new google.maps.LatLng(8.93, -79.5),
        new google.maps.LatLng(6.5, -79.66),
        new google.maps.LatLng(7.0, -90.0),
        new google.maps.LatLng(10.0, -100.0),
        new google.maps.LatLng(33.74, -118.24),
        new google.maps.LatLng(33.74, -118.24)
      ];

      var bpoints = [
        bvessel_position,
        new google.maps.LatLng(66.0, -23.0),
        new google.maps.LatLng(59.5, -44.0),
        new google.maps.LatLng(62.0, -65.15),
        new google.maps.LatLng(66.0, -77.4),
        new google.maps.LatLng(59.5, -92.4),
        new google.maps.LatLng(64.0, -77.4),
        new google.maps.LatLng(60.0, -65.15),
        new google.maps.LatLng(59.5, -44.0),
        new google.maps.LatLng(64.0, -23.0),
        bvessel_position
      ];

      var lbpoints = [
        lbvessel_position,
        new google.maps.LatLng(38.6, -9.58),
        new google.maps.LatLng(31.2, -10.0),
        new google.maps.LatLng(27.92, -13.2),
        new google.maps.LatLng(28.12, -15.4),
        new google.maps.LatLng(28.04, -15.31),
        new google.maps.LatLng(24.44, -15.4),
        new google.maps.LatLng(21.92, -17.2),
        new google.maps.LatLng(11.25, -18.4),
        new google.maps.LatLng(3.5, -7.6),
        new google.maps.LatLng(4.12, 9.6),
        new google.maps.LatLng(-16.0, 8.0),
        new google.maps.LatLng(-35.5, 18.4),
        new google.maps.LatLng(-34.32, 18.7),
        new google.maps.LatLng(-35.5, 18.4),
        new google.maps.LatLng(-16.0, 8.0),
        new google.maps.LatLng(4.12, 9.6),
        new google.maps.LatLng(3.5, -7.6),
        new google.maps.LatLng(11.25, -18.4),
        new google.maps.LatLng(21.92, -17.2),
        new google.maps.LatLng(24.44, -15.4),
        new google.maps.LatLng(28.04, -15.31),
        new google.maps.LatLng(28.12, -15.4),
        new google.maps.LatLng(27.92, -13.2),
        new google.maps.LatLng(31.2, -10.0),
        new google.maps.LatLng(38.6, -9.58),
        lbvessel_position
      ];

      function move(marker, points, fromPoint, toPoint, maxNumberSteps, step) {
        setTimeout(function() {
          if (step >= maxNumberSteps) {
            step = 1;
            if (++fromPoint >= points.length) {
              fromPoint = 0;
            }
            if (++toPoint >= points.length) {
              toPoint = 0;
            }
          }

          var lat = (points[fromPoint].lat()-points[toPoint].lat())/maxNumberSteps*step;
          var lng = (points[fromPoint].lng()-points[toPoint].lng())/maxNumberSteps*step;

          //console.log('moving. [lat='+lat+', lng='+lng+', from='+fromPoint+', to='+toPoint+', step='+step+']');

          //center the marker over the position
          //TODO only works at zoomlevel 12
          lat = lat+2;

          marker.setPosition(new google.maps.LatLng(points[fromPoint].lat()-lat, points[fromPoint].lng()-lng));

          move(marker, points, fromPoint, toPoint, maxNumberSteps, ++step);
        }, 1000);
      }



      function initializeMap() {
        var mapOptions = {
          center: default_position,
          mapTypeControl: false,
          streetViewControl: false,
          panControl: false,
          zoom: 3,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var styles = [
          {
            featureType: "administrative.country", 
            elementType: "geometry.stroke", 
            stylers: [ 
              { visibility: "off" } 
            ] 
          }
          ,
          {
            featureType: "administrative.province", 
            elementType: "geometry.stroke", 
            stylers: [ 
              { visibility: "off" } 
            ] 
          }
          ,
          {
            featureType: "all",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ]

        map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        map.setOptions({styles: styles});

        var iconBase = '/images/';
        marker = new google.maps.Marker({
          position: contact_marker_position,
          map: map,
          icon: iconBase + 'harbor_green.png'
        });

        bvesselMarker = new google.maps.Marker({
          position: bvessel_position,
          map: map,
          icon: iconBase + 'point_blue.png'
        });

        gvesselMarker = new google.maps.Marker({
          position: gvessel_position,
          map: map,
          icon: iconBase + 'point_green.png'
        });

        lbvesselMarker = new google.maps.Marker({
          position: lbvessel_position,
          map: map,
          icon: iconBase + 'point_lightblue.png'
        });

        infoBubble = new InfoBubble({
          content: '<h3 class="bubble-title">Uddevalla</h3><div class="content-body">Uddevalla is the homeport of AB almander marinconsult. As an old shipbuilding town it really connects with the nature of our business. For those interested - Wikipedia has some more information about the old <a href="http://sv.wikipedia.org/wiki/Uddevallavarvet" target="_blank" class="external">Uddevalla shipyard (swedish)</a>.</div>',
          maxWidth: 450,
          minHeight: 100,
          borderRadius: 4,
          arrowSize: 10,
          hideCloseButton: true,
          arrowStyle: 0
        });

        bvesselBubble = new InfoBubble({
          content: '<h3 class="bubble-title">Winch</h3>',
          maxWidth: 450,
          minHeight: 45,
          borderRadius: 4,
          arrowSize: 10,
          hideCloseButton: true,
          arrowStyle: 0
        });

        lbvesselBubble = new InfoBubble({
          content: '<h3 class="bubble-title">Suction&nbsp;pad</h3>',
          maxWidth: 450,
          minHeight: 45,
          borderRadius: 4,
          arrowSize: 10,
          hideCloseButton: true,
          arrowStyle: 0
        });

        gvesselBubble = new InfoBubble({
          content: '<h3 class="bubble-title">Electric&nbsp;motors</h3>',
          maxWidth: 450,
          minHeight: 45,
          borderRadius: 4,
          arrowSize: 10,
          hideCloseButton: true,
          arrowStyle: 0
        });

        bubbles = [
          gbubble = [gvesselBubble, gvesselMarker],
          bbubble = [bvesselBubble, bvesselMarker],
          lbbubble = [lbvesselBubble, lbvesselMarker]
        ];

        move(gvesselMarker, gpoints, 0, 1, 30, 1);
        move(bvesselMarker, bpoints, 0, 1, 50, 1);
        move(lbvesselMarker, lbpoints, 0, 1, 30, 1);

        swapBubbles(bubbles);
        setInterval(function(){swapBubbles(bubbles);},30000);

      }

      function swapBubbles(bubbles) {
        bubbleCounter = ++bubbleCounter%bubbles.length;
        
        for (var i = 0 ; i < bubbles.length ; i++) {
          bubbles[i][0].close();
        }

        if (services_active) {
          bubbles[bubbleCounter][0].open(map,bubbles[bubbleCounter][1]);
        }
      }
      
      var default_page_title = " / AB almander marinconsult";

      function set_page_title(page) {
        window.document.title = capitalize(page) + default_page_title;
      }

      function change_page(page) {
        //page = page.substring(1,page.length-1);
        page = page.replace(/#/g,"");
        console.log("changing page: " + page);
        update_position(page);
        set_section_visible(page);
        set_page_title(page);
        //update_uri(page);
      }

      function page_hook() {
        var _page = window.location['hash'];
        change_page(_page);
      }

      function update_uri(page) {
        console.log(window.location.hash);
        window.location.hash = "#" + page;
        console.log(window.location.hash);
      }

      function update_position(page) {
        if (page=="contact") {
          map.panTo(contact_position);
          map.setZoom(10);
        } else {
          map.panTo(default_position);
          map.setZoom(3);
        }
      }

      function set_section_visible(page) {
        var selector = "#content-" + page;
        var nav_selector = "#nav-" + page;

        if ($(nav_selector).length==0) {
          display_404();
        } else if (is_external_url()) {
          display_redirect();
        } else {
          $(".content").removeClass("visible");
          $(".content").addClass("hidden");
          $(selector).removeClass("hidden");
          $(selector).addClass("visible");

          $(".nav").removeClass("active");
          $(nav_selector).addClass("active");

          if (page == 'contact') {
            infoBubble.open(map,marker);
          } else {
            infoBubble.close();
          }
          if (page == 'services') {
            services_active = true;
            swapBubbles(bubbles);
          } else {
            services_active = false;
          }
          if (page == 'home') {
            $("body").addClass("storm");
            $("#map-wrapper").addClass("hidden");
          } else {
            $("body").removeClass("storm");
            $("#map-wrapper").removeClass("hidden");
          }
        }
      }

      function is_external_url() {
        return window.location.hostname.indexOf("almanderconsult.se") == -1;
      }

      function display_404() {
        $("#not-found").addClass("visible");
        $("#not-found").removeClass("hidden");
      }

      function display_redirect() {
        $("#welin").addClass("visible");
        $("#welin").removeClass("hidden");
      }

      function capitalize(page) {
        var page_title = page.substring(0,1).toUpperCase().concat(page.substring(1));
        console.log("Page title: " + page_title);
        return page_title;
      }

      $(function() {
        initializeMap();
        var _page = window.location['hash'];
        console.log("Hash: "+_page);
        if (_page.length==0) {
          _page = default_page;
        }
        change_page(_page);
        window.addEventListener("hashchange", page_hook, false);


        //$("a").click(function(event) {
        //  change_page($(this).attr('href'));
        //  //event.preventDefault();
        //  return false;
        //});

        //$("#nav-home a").click();
      });

