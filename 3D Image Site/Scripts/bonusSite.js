var BonusSite = BonusSite || {};

(function($, bonus) {
	
	var DISPLAY_MAX = new Number(10);
	var Z_DEPTH = new Number(-150);
	var VIEW_X = new Number();
	var VIEW_Y = new Number();
	var X_AXIS_DIRECTION = new Number();
	var Y_AXIS_DIRECTION = new Number();
	var DISTANCE_FROM_CENTER_X = new Number();
	var DISTANCE_FROM_CENTER_Y = new Number();
	var TWEEN_SPEED_1 = new Number(.4);
	var POSITION_ADJ = new Number(200);
	
	var selectedImage;
	
	var animatedObjects = new Array();
	var imageCollection = new Array('image1.jpg','image2.jpg','image3.jpg','image4.jpg','image5.jpg','image6.jpg');
	var imageCollectionCount = new Number(0);
	
	var imageCount = new Number(0);
	
	bonus.init = function() {	
		bonus.setup.init();	
	}
	
	bonus.setup = (function() {
				
		function init() {
			setup3D();
			setupStage();
		}
		
		function setup3D() {
			//Set the 3D perspective for the parent DIV
			TweenLite.set($('#stage'), {perspective:500});
		}
		
		function setupStage() {
			for(var i = new Number(0); i< DISPLAY_MAX; i++) {
				$('<div class="galleryImage"></div>').appendTo($('#stage'));
			}
			
			//Determine the position for the image in the foreground
			VIEW_X = Number($('#stage').width()-$('.galleryImage').width())/2;
			VIEW_Y = Number($('#stage').height()-$('.galleryImage').height())/2;
			
			var imageCount = 1;
						
			$('.galleryImage').each(function() {
				var startingZ = Z_DEPTH*imageCount;
				var startingOpacity = 1/imageCount;
				var startingX = Math.random()*Number($('#stage').width())-POSITION_ADJ;
				var startingY = Math.random()*Number($('#stage').height())-POSITION_ADJ;
				
				TweenLite.set($(this), {x: startingX, y: startingY, z: startingZ, opacity: startingOpacity, transformOrigin:"50% 50%"});
				
				$(this).click(function() {
					handleImageClick($(this));
				})
				
				//Add image
				setupImage($(this));
				
				animatedObjects.push($(this));
												
				imageCount++;
			})
			
			$(animatedObjects[0]).unbind('click');
			
		}
		
		function handleImageClick($i) {
			selectedImage = $i;
			animateStep();
		}
		
		//Splits the webkit transform matrix into an array we can use
		function matrixToArray(matrix) {
    		return matrix.substr(7, matrix.length - 8).split(', ');
		}
		
		function getCoordinates(div) {
			var position = $(div).position();
			var coordinates = new Array(position.left, position.top);
			
			return coordinates;	
		}
		
		function animateStep() {
			//Decide which direction everything will move
			determineImagePosition();
						
			for(var i = new Number(0); i< DISPLAY_MAX; i++) {
				//Determine how far on the z axis the object will move.  Find its position on the z axis and adjust it by the set value.
				var matrix = matrixToArray($(animatedObjects[i]).css("-webkit-transform"));
				var zAdjustment = Number(matrix[14])+Z_DEPTH*-1;	
				var div = animatedObjects[i];
				var opacityAdjustment = 1/i;
														
				//This handles the z axis and opacity animations
				if(i!=DISPLAY_MAX-1) {
					new TweenLite(div, TWEEN_SPEED_1, {opacity: opacityAdjustment, z: zAdjustment, ease: Linear.easeNone});
				} else {
					//On the very last animation, remove the foreground image and repeat the animation if needed.
					new TweenLite(div, TWEEN_SPEED_1, {opacity: opacityAdjustment, z: zAdjustment, onComplete: removeImage, ease: Linear.easeNone});
				}
				
				//Fade out and remove the nearest image, then remove it and add a new one.
				if(i==0) {
					//Fade out the foreground image as it passes through the z-limit
					new TweenLite(div, TWEEN_SPEED_1, {opacity: 0, ease: Linear.easeNone});
				}
			}
		}
		
		function determineImagePosition() {
			//All images move in relation to the clicked image.  If it moves up, so do they, and etc. for all directions.
			var position = $(selectedImage).position();
			
			//Determine the stage centerpoint.
			var stageCenterX = new Number($('#stage').width()/2);
			var stageCenterY = new Number($('#stage').height()/2);
			
			//Determine the clicked div's centerpoint.
			var divCenterX = new Number($('selectedImage').width()/2 + position.left);
			var divCenterY = new Number($('selectedImage').height()/2 + position.top);
			
			//Determine how far from the center our clicked image is.
			DISTANCE_FROM_CENTER_X = stageCenterX - divCenterX;
			if(DISTANCE_FROM_CENTER_X<0)DISTANCE_FROM_CENTER_X*=-1;
						
			DISTANCE_FROM_CENTER_Y = stageCenterY - divCenterY;
			if(DISTANCE_FROM_CENTER_Y<0)DISTANCE_FROM_CENTER_Y*=-1;
						
			//Determine whether we're to the right/above or the left/below of the center point
			if(divCenterX >= stageCenterX) {
				X_AXIS_DIRECTION = -1;
			} else {
				X_AXIS_DIRECTION = 1;
			}
			
			if(divCenterY >= stageCenterY) {
				Y_AXIS_DIRECTION = -1;
			} else {
				Y_AXIS_DIRECTION = 1;
			}
		}
				
		function removeImage() {
			//Remove the nearest DIV
			$(animatedObjects[0]).remove();
			//Remove it from the array of animated objects
			animatedObjects.splice(0,1);
			//Replace it with a new DIV at the back of the stack
			addImage();
			//Remove click event from foreground image
			$(animatedObjects[0]).unbind('click');
		}
		
		function setupImage(div) {
			var imagePath = 'img/'+imageCollection[imageCollectionCount];
			$(div).css('background', 'url('+imagePath+')');
			
			imageCollectionCount++;
			if(imageCollectionCount==imageCollection.length)imageCollectionCount=0;
		}
		
		function addImage() {
			$('<div class="galleryImage"></div>').appendTo($('#stage'));
			
			var startingZ = Z_DEPTH*DISPLAY_MAX-1;
			var startingOpacity = 1/DISPLAY_MAX-1;
			var startingX = Math.random()*Number($('#stage').width());-POSITION_ADJ
			var startingY = Math.random()*Number($('#stage').height())-POSITION_ADJ;
			
			TweenLite.set($('.galleryImage')[DISPLAY_MAX-1], {x: startingX, y: startingY, z: startingZ, opacity: startingOpacity, transformOrigin:"50% 50%"});
			animatedObjects.push($('.galleryImage')[DISPLAY_MAX-1]);
			
			$(animatedObjects[DISPLAY_MAX-1]).click(function() {
					handleImageClick($(this));
			})
			
			//Add image
			setupImage(animatedObjects[DISPLAY_MAX-1]);
			
			checkAnimationStatus();
		}
		
		function checkAnimationStatus() {
			//Check to see if the foreground image is the one the user chose.  If not, keep animating.
			//Grab the current z value of the div
			var matrix = matrixToArray($(animatedObjects[0]).css("-webkit-transform"));
			//Make sure the foreground image wasn't the one clicked.  Grab the z-value.
			var currentMatrix =  matrixToArray($(selectedImage).css("-webkit-transform"));
			
			if(matrix[14]!=currentMatrix[14]) {
				//Animate again if the selected image is not at the top
				animateStep();	
			} else {
				//Center the selected image when it reaches the top
				new TweenLite(animatedObjects[0], TWEEN_SPEED_1, {x: VIEW_X, y: VIEW_Y});
			}
		}
		
		return {
			init: function () {
				init();
			}
		}
	})();
	
	this.Construct = (function() {
		$(document).ready(function() {
			bonus.init();
		});
	})();
	
})(jQuery, BonusSite);