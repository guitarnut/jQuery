//Requires jQuery

var UI = UI || {};

UI.SimpleGallery = (function() {
	
	var $prev,
	$next,
	$text,
	$imageContainer,
	images = new Array(),
	imageCount = 0;
	
	function setGalleryElements(prev, next, text, image) {
		 $prev = $(prev);
		 $next = $(next);
		 $text = $(text);
		 $imageContainer = $(image);
		
		storeImages();
		setupGallery();
	}
	
	function storeImages() {
		images = new Array(); 
		$imageContainer.children('img').each(function() { 
			images.push($(this));
			$(this).hide();
		});
		
		imageCount = 0;
		$(images[imageCount]).show();
		
		updateText();
	}
	
	function setupGallery() {
		$prev.click(function() { changeImage(-1); })
		$next.click(function() { changeImage(1); })
	}
	
	function changeImage(n) {
		$(images[imageCount]).hide();
		
		imageCount = imageCount + n;
		if(imageCount < 0) imageCount = images.length -1;
		if(imageCount === images.length) imageCount = 0;
		
		$(images[imageCount]).show();
		
		updateText();
	}
	
	function updateText() {
		$text.text((imageCount+1)+' of ' + images.length);
	}
	
	window.onscroll = function() {
		scrollHint.style.display = 'none';
	}
	
	return {
		init: setGalleryElements,
		reset: storeImages
	}
	
})();