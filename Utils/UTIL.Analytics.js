var UTIL = UTIL || {};

(function($, UTIL) {
	
	UTIL.Tracking = (function () {
	
		function setupTracking() {
			//Nav
			$('').click(function() {
				var category='',
				action = 'HREF: none',
				detail = 'ID: ' + $(this).attr('id') + ', CLASS: ' + $(this).attr('class');
				
				trackEvent(category, action, detail);
			});
		}
		
		function trackEvent(category, action, detail) {
			ga('send', 'event', category, action, detail);
			//console.log('Tracked: '+category, action, detail);
		}
		
		return {
			init: setupTracking
		}
	})();
	
	Construct = (function() {
		$(document).ready(function() {
			UTIL.Tracking.init();
		})
	})();
	
})(jQuery, UTIL);