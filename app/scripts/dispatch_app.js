define([], function () {
  var mapOptions = {
    center: new google.maps.LatLng(37.773572, -122.409710),
    zoom: 15,
    disableDefaultUI: true,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false
  };

  var statusText = {
    AWAITING_DISPATCH: "Awaiting Dispatch...",
    DISPATCH_FOUND: "Dispatch found!"
  };

  return {
    initialize: function (pubnub) {
      this.pubnub = pubnub;

      this.map = new google.maps.Map(document.querySelector("#dispatch-map"), mapOptions);

      this.text = document.querySelector('#dispatch-text');
      this.text.innerHTML = statusText.AWAITING_DISPATCH;
    }
  };
});
