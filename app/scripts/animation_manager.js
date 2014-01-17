define([], function () {
  'use strict';

  var animations = [];

  return {
    initialize: function () {
      var elements = Array.prototype.slice.call(document.querySelectorAll('.animate-scroll'), 0);
      elements.forEach(function (el, i) {
        if (el) {
          animations[i] = {
            el: el,
            y: el.getBoundingClientRect().top - (window.innerHeight >> 1)
          };
        }
      });

      var previous = 0;
      function animate() {
        var posY = window.scrollTop || window.scrollY;
        
        // Find the number of animations to play
        var current = 0;
        if (posY > previous && animations.length !== 0) {
          while(current < animations.length && animations[current].y < posY) {
            current++;
          }

          // Play all found animations
          while(current > 0) {
            animations[0].el.className += " animated";
            animations.shift();
            current--;
          }
        }
      };
      animate();
      window.addEventListener('scroll', function () {
        requestAnimationFrame(animate);
      });
    }
  };
});
