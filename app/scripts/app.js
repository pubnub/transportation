/*global define */
define(['animation_manager', 'dispatch_app'], function (AnimationManager, DispatchApp) {
    'use strict';

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
        DispatchApp.initialize(this.pubnub);
      },

      listenForBusUpdates: function () {
        this.pubnub.subscribe({
          channel: 'test_bus',
          callback: (function (data) {
            data.id = data.id.toString();
            var bus = this.buses[data.id];

            // Create new marker if it does not exist
            if (!bus) {
              bus = this.createNewBus(data.id);
            }

            var latLng = new google.maps.LatLng(data.lat, data.lon);
            bus.setPosition(latLng);
          }).bind(this)
        });
      },

      createNewBus: function (id) {
        var latLng = new google.maps.LatLng(0, 0);

        this.buses[id] = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: "Bus: " + id
        });

        return this.buses[id];
      }
    };
});
