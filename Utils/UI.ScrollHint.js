var UI = UI || {};

UI.ScrollHint = (function() {
	
	var scrollHint;
	
	function setScrollElement(id) {
		 scrollHint = document.getElementById(id);
	}
	
	window.onscroll = function() {
		scrollHint.style.display = 'none';
	}
	
	return {
		set: setScrollElement
	}
	
})();