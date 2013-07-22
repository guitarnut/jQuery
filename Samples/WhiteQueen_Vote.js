var WQ = WQ || {};
(function($, WQ) {
/***************
	START THE PARTY
	****************/
	WQ.Vote = (function() {
		$vote = {};
/***************
		INIT
		****************/
		var $pollXMLData;

		function init() {
			loadData("data/polls.xml");
			$vote.w = $('.vote');
			$vote.close = $vote.w.find('.close-button');
			$vote.link = $('.link-layer');
			$('.voteButton').click(openVote);
			$vote.close.click(closeVote);
		}
/***************
		JSON FEED
		****************/
		function loadData($path) {
			$.ajax({
				type: 'GET',
				url: $path,
				dataType: 'xml',
				success: dataLoaded,
				error: loadError
			});
		}
/***************
		DATA LOADED
		****************/
		function dataLoaded(data) {
			$pollXMLData = $(data);
			buildPolls();
		}
/***************
		POPULATE CONTENT
		****************/
		function buildPolls() {
			$pollXMLData.find('poll').each(function() {
				var $pollHTML = String();
				var $pollResultsHTML = String();
				var $winnersHTML;
				//Grab poll data
				var $avail = $(this).find('available').text();
				var $ep = $(this).find('episode').text();
				var $num = $(this).find('number').text();
				var $desc = $(this).find('description').text();
				var $p_name = $(this).find('displayName').text();
				var $d_name = $(this).find('dataName').text();
				//Build the first section of HTML
				$pollHTML = '<div id="' + $d_name + 'Poll" class="vote-boxLarge">' + 
										'<div class="poll-title"><img src="img/icons/' + $d_name + '_large.png" width="85" height="85"/>' + $p_name + '</div>' + 
										'<div class="poll-desc">' + $desc + '</div>';
										
				//------------- ANSWERS --------------- //
				//Build answer nodes and results nodes
				var answers = Array();
				$(this).find('answer').each(function() {
					answers.push($(this));
				})
				//Start the Answers DIV
				$pollHTML += '<div id="' + $d_name + 'Answers" class="poll-answers">'+
										'<input type="hidden" class="pollData" episode="' + $ep + '" poll="' + $num + '" available="' + $avail + '">' ;
										
				for (var i = 0; i < answers.length; i++) {
					var $ans = i + 1;
					var $img = answers[i].find('image').text();
					var $name = answers[i].find('name').text();
					var $video = answers[i].find('video').text();
					$pollHTML += '<div class="poll-answerItem">' + 
											'<img src="img/polls/' + $img + '.jpg" width="95" height="125" answer="' + $ans + '"/>' + 
											'<div class="poll-characterName">' + $name + '</div>' + 
											'<div class="poll-link" vPath="' + $video + '">Watch Video</span></div>' + 
											'</div>';
					//We'll create these values now and add them later;					
					$pollResultsHTML += '<div class="poll-resultsItem">' +
														 '<img src="img/polls/' + $img + '.jpg" width="60" height="80" answer="1"/>' +
														 '<div class="result-characterName">' + $name + '</div>' + 
														 '<div id="' + $d_name + 'Answer'+$ans+'Total" class="poll-bar"></div>' +
														 '</div>';
				}
				//Close the poll answers DIV
				$pollHTML += '</div>';
				//------------- POLL RESULTS --------------- //
				//Add the results div and with the individual results
				$pollHTML += '<div id="' + $d_name + 'Results" class="poll-results">';
				$pollHTML += $pollResultsHTML;
				$pollHTML += '</div>';
				//Close the main DIV
				$pollHTML += '</div>';
				//Add the poll to the HTML
				$('#pollPlaceholder').after($pollHTML);
				//------------- POLL WINNERS --------------- //
				//Create the next DIV, which contains the winners for each poll
				$winnersHTML = '<div id="' + $d_name + 'Winners" class="vote-boxLarge">' + 
											'<div class="poll-title">' +
											'<img src="img/icons/' + $d_name + '_large.png" width="85" height="85" />' + $p_name +
											'</div>' + 
											'<div class="poll-desc">' + $desc + '</div>' +
											'<div class="poll-noPastWInners">No characters have won this poll.</div>' +
											'</div>';
				//Add it after the poll we created
				$('#pollPlaceholder').after($winnersHTML);
				//Finally, create the nav button for the poll
				var $buttonPollsHTML = '<div id="' + $d_name + 'Button" class="poll-button" available="' + $avail + '">' + 
														'<img src="img/icons/' + $d_name + '_small.png" width="40" height="40" />' + $p_name + 
														'</div>';
				var $buttonWinnersHTML = '<div id="' + $d_name + 'Button" class="poll-button">' + 
															'<img src="img/icons/' + $d_name + '_small.png" width="40" height="40" />' + $p_name + 
															'</div>';
				$($buttonPollsHTML).appendTo('#availablePollsList');
				$($buttonWinnersHTML).appendTo('#pastWinnersList');
				if ($avail == "false") {
					var $b_off = "#" + $d_name + "Button";
					$($b_off).css('opacity', '.25');
				}
				//Hide the results
				$('.poll-results').hide();
				$(".poll-button:first-child").attr("class", "poll-button-active");
			})
			//Poll Buttons	
			$('.poll-button').click(function() {
				if ($(this).attr('available') != "false") {
					var $p = String($(this).attr('id')).replace('PollButton', '');
					if (currentTab != $p) {
						activatePoll($p);
					}
				}
			})
			//Vote buttons
			$('.poll-answerItem img').click(function() { handleVote($(this)); });
			activatePoll(currentPoll);
		}
/***************
		POLLS LOGIC
		****************/
		//starting up
		activateCurrentPolls();
		stripInnactive();
				
		//Tabs
		$("#currentPollsButton").click(function() {
			if (currentTab != "currentPolls") {
				activateCurrentPolls();
			}
		});
		$("#pastWinnersButton").click(function() {
			if (currentTab != "pastWinners") {
				activatePastWinners();
			}
		});
		var currentPoll = 'powerPlayer';
		var currentTab = "currentPolls";

		function activateCurrentPolls() {
			currentTab = "currentPolls";
			$("#availablePollsList").css("visibility", "visible");
			$("#pastWinnersList").css("visibility", "hidden");
			$("#currentPollsButton").attr("class", "active-tab");
			$("#pastWinnersButton").attr("class", "link-tab");
		}

		function activatePastWinners() {
			currentTab = "pastWinners";
			$("#availablePollsList").css("visibility", "hidden");
			$("#pastWinnersList").css("visibility", "visible");
			$("#currentPollsButton").attr("class", "link-tab");
			$("#pastWinnersButton").attr("class", "active-tab");
			activatePoll(currentPoll);
		}

		function activatePoll($p) {
			//Strip this if it exists in $p
			$p = String($p).replace('WinnersButton', '');
			$p = String($p).replace('Button', '');
			currentPoll = String($p);
			var $id_poll = String("#" + $p + "Poll");
			var $b_poll = String("#" + $p + "PollButton");
			var $id_winners = String("#" + $p + "Winners");
			var $b_winners = String("#" + $p + "WinnersButton");
			$(".vote-boxLarge").css("visibility", "hidden");
			if (currentTab == "currentPolls") {
				$($id_poll).css("visibility", "visible");
			} else {
				$($id_winners).css("visibility", "visible");
			}
			$(".poll-button-active").attr("class", "poll-button");
			$($b_poll).attr("class", "poll-button-active");
			$($b_winners).attr("class", "poll-button-active");
		}

		function stripInnactive() {
			$('#availablePollsList > .poll-button').each(function() {
				var $n = String($(this).attr('id')).replace('PollButton', '');
				var $b = String($(this).attr('id'));
				if (currentPoll != $n) {
					$($b).remove();
				}
			})
		}
		//Poll Logic		
		function handleVote($t) {
			//Set the containing object here
			var parent = $($t).closest('div');
			//Poll Name
			var $n = String($($t).closest('.poll-answers').attr('id')).replace('Answers', '');
			//Store the episode and poll numbers
			var episode = $(parent).parent('div').children('.pollData').attr('episode');
			var poll = $(parent).parent('div').children('.pollData').attr('poll');
			//Store the user's answer
			var answer = $($t).attr('answer');			
			dataLoading();
			$.ajax({
				url: "Scripts/PollData.php",
				type: "POST",
				data: {
					episode: episode,
					poll: poll,
					answer: answer
				},
				success: function(result) {
					var results = $.parseJSON(result);
					populateValues(results);
					dataLoaded();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//Handle Error
				},
				complete: function(data) {
					//Next steps
				}
			})
			
			function populateValues($r) {
				//139 being the width of the bar
				var $a1 = '#' + $n + 'Answer1Total';
				var $a2 = '#' + $n + 'Answer2Total';
				var $a3 = '#' + $n + 'Answer3Total';
				var $a4 = '#' + $n + 'Answer4Total';
								
				$($a1).css("width", ((($r.answer1Totals / $r.totalVotes) * 100) * 1.39));				
				$($a2).css("width", ((($r.answer2Totals / $r.totalVotes) * 100) * 1.39));				
				$($a3).css("width", ((($r.answer3Totals / $r.totalVotes) * 100) * 1.39));
				$($a4).css("width", ((($r.answer4Totals / $r.totalVotes) * 100) * 1.39));
			}

			function dataLoading() {
				//Handle loading icons, timeouts, etc. here
			}
	
			function dataLoaded() {
				//Handle view here after data has loaded			
				var $answers = '#' + $n + 'Answers';
				var $results = '#' + $n + 'Results';
				$($answers).hide();
				$($results).show();
			}
		
		}

/***************
		ERROR LOAD
		****************/
		function loadError(jqXHR, textStatus, errorThrown) {
			console.log("DATA loaderror", errorThrown);
		}
/***************
		OPEN VOTE		
		****************/
		function openVote() {
			var t = $(this);
			$vote.link.hide();
			$vote.w.show();
		}
/***************
		CLOSE VOTE
		****************/
		function closeVote() {
			$vote.w.hide();
			$vote.link.show();
		}
/***************
		PUBLIC
		****************/
		return {
			init: init
		}
	})();
	Construct = (function() {
		$(document).ready(function() {
			WQ.Vote.init();
		});
	})();
})(jQuery, WQ);