var Flowchart = Flowchart || {};

(function ($, Flowchart) {
	
	var DEV_MODE = new Boolean(false),
	CONSOLE_ACTIVE = new Boolean(true),
	BASE_PATH = new String('assets/'),
	ANIMATION_SPEED_1 = 2000,
	_xml = {},
	_html = new String(),
	//ENTER THE STARTING QUESTION HERE
	_userChoices = new Array('q1'),
	//
	_buttonsDisabled = new Boolean(true),
	_topIndex = new Number(5000),
	_bottomIndex = new Number(5000),
	_pathIndex = 100,
	_imageIndex = 200,
	_questionIndex = 300,
	_answerIndex=400,
	_targetPath='0',
	$viewScreen;
	
	Flowchart.Init = function() {
		//Workaround until IE features are patched
		if($.browser.msie==true) {
			Flowchart.IE.init();
		} else {
			Flowchart.LoadData.init();
			Flowchart.StatusBar.init();
		}
	}
	
	Flowchart.IE = (function() {
		function init() {
			$('#statusBar').hide();
			var html = "<p align='center' style='font-size: 12px; color: #FFF; margin: 50px 20px 0 20px;'><img src='assets/spartacus_message.png' width='200' height='289' /></p><p align='center' style='font-size: 12px; color: #FFF; margin: 10px 20px 0 20px;'><strong>Halt Soldier!</strong><br>This application uses features not supported by your web browser.  Please choose a different browser.</p>";
			$(html).appendTo('#container');
		}
		
		return {
			init: init
		}
	})();
	
	Flowchart.LoadData = (function() {
		
		function init() {
			loadXML();
		}
		
		function loadXML() {
			$.ajax ({
				type:'GET',
				url: "setup.xml",
				dataType:'xml',
				success: dataLoaded, 
				error: loadError
			});	
		}
		
		function dataLoaded(xml) {
			_xml = xml;
			Flowchart.BuildContent.init();
		}
		
		function loadError(jqXHR, textStatus, errorThrown) {
			//if(CONSOLE_ACTIVE==true)console.log('Could not load XML: ' , errorThrown);
		}
		
		return {
			init: init
		}
	})();
	
	Flowchart.BuildContent = (function() {
		
		function init() {
			parseXML();
		}
		
		function parseXML() {
			var $totalNodes = Number($(_xml).find('node').length);
			var $count = 0;

			$(_xml).find('node').each(function(){
 				var $node = $(this);
				var $x = Number($node.attr('xPos'));
				var $y = Number($node.attr('yPos'));
				var $img;
				var $uniqueID = $node.attr('description');
				var $type= $node.attr('type');

				//UNIQUE DIV CONTAINER FOR THIS QUESTION, ITS PATHS, AND CHOICES
				var _html = "<div id='"+$uniqueID+"' class='node' type='"+$type+"' style='position: absolute; left: "+$x+"px; top: "+$y+"px;'>"
				
				switch($type) {
					//QUESTIONS FEATURE TEXT AND TWO OR MORE POSSIBLE ANSWERS
					case 'QUESTION':
					$node.find('question').each(function() {
						var $question = $(this);
						$x = Number($question.attr('xPos'));
						$y = Number($question.attr('yPos'));
						$img = $question.text();

						_html +="<div class='question' style='position: absolute; left: "+$x+"px; top: "+$y+"px; z-index: "+_questionIndex+";'><img src='"+BASE_PATH+$img+"'></div>"
					})
					break;
					//OPTIONS FEATURE ONLY ANSWERS
					case 'OPTIONS':
					break;
					//ENDINGS FEATURE A LINK TO THE ENDING CONTENT
					case 'ENDING':
					$node.find('ending').each(function() {
						var $ending = $(this);
						$x = Number($ending.attr('xPos'));
						$y = Number($ending.attr('yPos'));
						$img = $ending.text();
						$endingImage = $node.find('endingImage').text();

						_html +="<div class='ending' style='position: absolute; left: "+$x+"px; top: "+$y+"px; z-index: "+_questionIndex+";'><img class='hotspot' endingImage='"+BASE_PATH+$endingImage+"' src='"+BASE_PATH+$img+"'></div>"
					})
					break;
					default:
					break;
				}

				//OPTIONS ARE THE USERS CHOICES.  OPTIONS CAN EXIST WITH OR WITHOUT A QUESTION
				$node.find('option').each(function() {
						var $option = $(this);
						$x = Number($option.attr('xPos'));
						$y = Number($option.attr('yPos'));
						$img = $option.text();

						var $target = $option.attr('target');
						var $targetPath = $option.attr('targetPath');

						_html +="<div target='"+$target+"' targetPath='"+$targetPath+"' class='option hotspot' style='position: absolute; left: "+$x+"px; top: "+$y+"px; z-index: "+_answerIndex+";'><img src='"+BASE_PATH+$img+"'></div>"
					})
					
				//OPTIONAL IMAGES THAT SIT BEHIND THE TEXT BOXES
				$node.find('image').each(function() {
						var $nodeImage = $(this);
						$x = Number($nodeImage.attr('xPos'));
						$y = Number($nodeImage.attr('yPos'));
						$img = $nodeImage.text();

						_html +="<div class='nodeImage' style='position: absolute; left: "+$x+"px; top: "+$y+"px; z-index: "+_imageIndex+";'><img src='"+BASE_PATH+$img+"'></div>"
					})

				//PATHS ARE THE LINES LEADING INTO THE CURRENT SET OF QUESTIONS AND ANSWERS
				$node.find('path').each(function() {
						var $path = $(this);
						$x = Number($path.attr('xPos'));
						$y = Number($path.attr('yPos'));
						$img = $path.text();
						
						var $option = $path.attr('option');

						_html +="<div option='"+$option+"' class='nodePath' style='position: absolute; left: "+$x+"px; top: "+$y+"px; z-index: "+_pathIndex+";'><img src='"+BASE_PATH+$img+"'></div>"
					})

				//CLOSE THE UNIQUE DIV
				_html += "</div>";
				
				//USE DEV_MODE TO CHECK THE FULL LAYOUT
				if(DEV_MODE==true) {
					$(_html).appendTo($('#viewscreenPreview'));
					$('#container').hide();
				} else {
					$(_html).appendTo($('#viewscreen'));
				}

				$count++;
				if($count==$totalNodes)dataComplete();
			});

		}

		function dataComplete() {
			$viewScreen = $('#viewscreen');
			Flowchart.Control.init();
		}
		
		return {
			init: init
		}
		
	})();

	Flowchart.Control = (function() {

		var $nextSection;

		function init() {
			setupButtons();
			start();
		}

		function start() {
			Flowchart.StatusBar.toggleBar(true);
			$('#viewscreen .node').css({opacity:0});
			$('#viewscreen .nodePath').css({opacity:0});
			$('#viewscreen .node').show();

			//ALLOW THE PROGRAM TIME TO PLACE THE ELEMENTS BEFORE ANIMATING THEM
			setTimeout(function(){nextSection()},1000);
		}

		function toggleNodeOpacity($n, b$) {
			if(b$==true) {
				$n.animate({opacity: 1}, ANIMATION_SPEED_1);
				$n.children('.nodePath').each(function() {
					
					//CHECK TO SEE IF THERE'S MORE THAN ONE PATH LEADING TO THIS NODE, AND ACTIVATE THE CORRECT PATH IF THERE ARE MULTIPLE ONES
					if($(this).attr('option')==_targetPath) {
						$(this).animate({opacity: 1}, ANIMATION_SPEED_1);
						//if(CONSOLE_ACTIVE==true)console.log('Multiple paths detected, animating path '+_targetPath);
					}
				})
			}
			if(b$==false) {
				//HIDE THE NODE
				$n.animate({opacity: 0}, ANIMATION_SPEED_1/2);
				//HIDE ALL THE PATHS IN THE NODE
				$n.children('.nodePath').each(function() {
					$(this).animate({opacity: 0}, ANIMATION_SPEED_1);
				})
			}
		}

		function setupButtons() {
			//UNUSED
			$('.option').mouseover(function() {
				
			});
			$('.option').mouseout(function() {
				
			});
			
			//HANDLE THE CLICK WHEN THE USER MAKES A CHOICE
			$('.option').click(function() {
				if(_buttonsDisabled==false) {
					//MAKE SURE THE BUTTON BEING CLICKED IS IN THE CURRENT NODE
					if($(this).parent('div').attr('id')==$nextSection.attr('id')) {
						toggleButtons(true);
	
						var $target = $(this).attr('target');
						_userChoices.push($target);
						
						//IF THE TARGET NODE HAS MULTIPLE PATHS LEADING TO IT, SELECT THE CORRECT ONE
						_targetPath = $(this).attr('targetPath');
						//if(CONSOLE_ACTIVE==true)console.log('This button targets a specific path: '+_targetPath);
						
	
						var $container = $($(this).parent('div'));
						//$container.css('z-index', _bottomIndex);
	
						//if(CONSOLE_ACTIVE==true)console.log('Stored user choice: '+$target+'. '+_userChoices.length+' choices stored so far.');
	
						nextSection();
					} else {
						//if(CONSOLE_ACTIVE==true)console.log('Button doesn\'t match current node: ' + $nextSection.attr('id') + ', ' + $(this).parent('div').attr('id'));
					}
				}
			})
			
			//HANDLE THE ENDINGS
			$('.ending img').click(function() {
				var endingImage = $(this).attr('endingImage');
				showEnding(endingImage);
				//if(CONSOLE_ACTIVE==true)console.log(endingImage + ' selected.');
			})
			
			//HANDLE THE CLICK WHEN THE USER WANTS TO GO BACK ONE STEP
			//$('#statusBar .backButton').click(function() {
				//if(_buttonsDisabled==false) {
					////if(CONSOLE_ACTIVE==true)console.log('Going back one step')
					//goBack();
				//}
			//})
			//RESET THE GAME
			$('#statusBar .resetButton').click(function() {
				resetBoard();
			})
		}
		
		function resetBoard() {
			if(_buttonsDisabled==false) {
				toggleButtons(true);
				//RESET ALL THE STORED CHOICES
				_userChoices = new Array('q1');
				toggleNodeOpacity($('.node'), false);
				nextSection();
			}
		}

		function toggleButtons($b) {
			_buttonsDisabled = $b;
			//if(CONSOLE_ACTIVE==true)console.log('Buttons disabled: '+_buttonsDisabled)
		}

		function nextSection() {
			//if(CONSOLE_ACTIVE==true)console.log('Advancing to '+_userChoices[_userChoices.length-1]);

			$nextSection = $('#' + _userChoices[_userChoices.length-1]);

			animateNextSection();
		}

		//REMOVE THE LAST SELECTION THE USER MADE, THEN GO TO THE SELECTION BEFORE IT
		function goBack() {
			var $spliceEnd = _userChoices.length-1;

			if($spliceEnd > 0) {
				toggleButtons(true);

				$deletedSelection = $('#' + _userChoices[_userChoices.length-1]);
				toggleNodeOpacity($deletedSelection, false);

				_userChoices = _userChoices.slice(0,$spliceEnd);				
				nextSection();

				//if(CONSOLE_ACTIVE==true)console.log($spliceEnd+' stored choices remain for deletion')
				//if(CONSOLE_ACTIVE==true)console.log('Stored data remaining: '+_userChoices.length)
				//if(CONSOLE_ACTIVE==true)console.log('Removed end index from user choices array')
			}
		}

		function changeIndex() {
			//PUT THE NEXT SECTION ON TOP
			//$nextSection.css('z-index', _topIndex);
			////if(CONSOLE_ACTIVE==true)console.log('z-index adjusted')
		}

		function animateNextSection() {
			var $targetObject;
			var $type = $nextSection.attr('type');

			//if(CONSOLE_ACTIVE==true)console.log($type);

			switch($type) {
				case 'QUESTION':
				$targetObject = $nextSection.children('.question:first-child');
				break;
				case 'OPTIONS':
				$targetObject = $nextSection.children('.option:first-child');
				break;
				case 'ENDING':
				$targetObject = $nextSection.children('.ending:first-child');
				break;
				default:
				break;
			}

			var $totalXDistance = $nextSection.position().left + $targetObject.position().left + $targetObject.width()/2; 
			var $totalYDistance = $nextSection.position().top + $targetObject.position().top;

			//THIS IS THE X/Y LOCATION WE'RE GOING TO ANIMATE TO
			var $targetX = $('#container').width()/2;
			var $targetY = 180;

			var $newX = $targetX - $totalXDistance;
			var $newY = $targetY - $totalYDistance;

			//if(CONSOLE_ACTIVE==true)console.log('Coordinates: '+$newX, $newY)

			$viewScreen.animate({'top':$newY+'px', 'left':$newX+'px'}, ANIMATION_SPEED_1, 
				function(){
					toggleButtons(false);
					changeIndex();
					})
					
			toggleNodeOpacity($nextSection, true);
		}
		
		function showEnding(endingImage) {
			var html = "<div style='position: absolute; top: 0; left: 0; display: none; width: 800px; height: 600px; z-index: 8000;' id='endingOverlay'><img src='"+endingImage+"' /></div>";
			$(html).appendTo('#container');
			
			$('#endingOverlay').fadeIn('fast');
			
			$('#endingOverlay').click(function() {
				resetBoard();
				$(this).unbind('click');
				$(this).fadeOut('slow', function() {
					$(this).remove();	
				});
			});
			
		}
				
		return {
			init: init,
			start: start,
			toggleButtons: toggleButtons,
			nextSection: nextSection
		}
		
	})();

	Flowchart.StatusBar = (function() {

		var $status;
		
		function init() {
			$status = $('#statusBar');
		}

		function updateStatus($u) {

		}

		function toggleBar(b$) {
			if(b$==true)$status.fadeTo('fast',1);
			if(b$==false)$status.fadeOut();
		}
		
		return {
			init: init,
			updateStatus: updateStatus,
			toggleBar: toggleBar
		}
		
	})();
	
	Flowchart.Setup = (function() {
		
		function init() {
		}
		
		return {
			init: init
		}
		
	})();
	
	this.Construct = (function() {
		$(document).ready(function() {
			Flowchart.Init();
		});
	})();
	
})(jQuery, Flowchart);