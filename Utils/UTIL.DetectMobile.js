var UTIL = UTIL || {};

(function($, UTIL) {

	UTIL.DetectMobile = (function () {
	
		function detectMobile() {
			var agent   = navigator.userAgent;
			
			if ( agent.match(/(iPhone|iPod|iPad|Blackberry|Android)/) ) {
				return true;
			} else {
				return false;
			}
		}
		
		function detectIOS() {
			if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
				return true;
			} else {
				return false;
			}
		}
		
		return {
			isIOS: function() {
				return detectIOS();
			},
			isMobile: function() {
				return detectMobile();
			}
		}
		
	})();
		
})(jQuery, UTIL);