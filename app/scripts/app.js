/*global define */
define(['animation_manager', 'dispatch_app'], function (AnimationManager, DispatchApp) {
    'use strict';

    function easeInOutQuad(t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (-2 * tc + 3 * ts);
    };

    return {
      init: function () {
        this.pubnub = PUBNUB.init({
          subscribe_key: 'sub-c-4b7887ee-ced1-11e2-ad99-02ee2ddab7fe'
        });
        this.buses = {};
        this.listenForBusUpdates();

        var mapOptions = {
          center: new google.maps.LatLng(37.774682, -122.419710),      
          zoom: 15,
          disableDefaultUI: true,
          scrollwheel: false,
          navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
          draggable: false
        };

        this.map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);
        
        AnimationManager.initialize();
        DispatchApp.initialize();
        
        // Test the animation
        // this.createNewBus("special", new google.maps.LatLng(37.774682, -122.419710));
        // this.animateToPosition(this.buses["special"], new google.maps.LatLng(37.778682, -122.419710));
      },

      listenForBusUpdates: function () {
        this.pubnub.subscribe({
          channel: 'test_bus',
          callback: (function (data) {
            data.id = data.id.toString();
            var bus = this.buses[data.id];

            var latLng = new google.maps.LatLng(data.lat, data.lon);

            // Create new marker if it does not exist
            if (!bus) {
              bus = this.createNewBus(data.id, latLng);
            } else {
              this.animateToPosition(this.buses[data.id], latLng);
            }
          }).bind(this)
        });
      },

      animateToPosition: function (marker, position) {
        var start = marker.getPosition(),
            time = 0,
            duration = 5,
            lastTime = Date.now();
        
        start = { lat: start.lat(), lng: start.lng() };
        position = { lat: position.lat(), lng: position.lng() };

        if (Math.abs(start.lat - position.lat) < 0.000001 && Math.abs(start.lng - position.lng) < 0.000001) {
          return;
        }

        var animate = function () {
          time += (Date.now() - lastTime) / 1000;
          lastTime = Date.now();
          var lat = easeInOutQuad(time, start.lat, (start.lat - position.lat), duration),
              lng = easeInOutQuad(time, start.lng, (start.lng - position.lng), duration);
          marker.setPosition(new google.maps.LatLng(lat, lng));

          if (time < duration) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      },

      createNewBus: function (id, latLng) {
        var image = '/static/taxiicon.png';

        this.buses[id] = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: "Bus: " + id,
          icon: image,
          animation: google.maps.Animation.DROP
        });

        return this.buses[id];
      }
    };
});
