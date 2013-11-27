var BS_PressKit = BS_PressKit || {};

(function ($, BS_PressKit) {
	
	BS_PressKit.PanoramicFX = (function () {
		
		var RANGE = 50,
		DELAY = 100,
		IMAGE_WIDTH = 1000,
		TWEEN_SPEED,
		$p = $('.panoramic'),
		totalWidth,
		midpoint,
		percent,
		xPos,
		movePanoramic,
		myInterval;
		
		function init () {
			calculateValues();
			setupPanoramicFX();
			
			//myInterval = setInterval(function() { animatePanoramic() }, DELAY);
		}
		
		function setupPanoramicFX() {			
			window.onmousemove = handleMouseMove;
			window.onresize = calculateValues;
 		}
 		
 		function calculateValues() {
	 		totalWidth = window.innerWidth;
	 		TWEEN_SPEED = DELAY/1000
 		}
 		
 		function handleMouseMove(event) {
	        event = event || window.event;
	        if(event.clientY > 100) xPos = event.clientX;
	    }
	    
	    function animatePanoramic() {
	    	percent = xPos/totalWidth;
			movePanoramic = Math.round(RANGE*percent) + IMAGE_WIDTH;
			console.log(movePanoramic);
			movePanoramic = '-'+movePanoramic+'px';
			
		    TweenLite.to($p, TWEEN_SPEED, {'left': movePanoramic, ease: Linear.easeNone, overwrite: "all"});
	    }

				
		return {
			init: init
		}
		
	})();
	
	Construct = (function() {
		$(document).ready(function() {
			BS_PressKit.PanoramicFX.init();
		})
	})();
	
})(jQuery, BS_PressKit);