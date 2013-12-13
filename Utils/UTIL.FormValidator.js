var UTIL = UTIL || {};

UTIL.FormValidator = function () {
		
	/* REGEX Patterns */
	var validateString = /[a-z]/i,
	validatePhone = /[0-9| ()|-]/i,
	validateZip = /[0-9{5}]/i,
	validateAddress = /[0-9{1,10}]+[ ]+[a-z{1,200}]/i,
	validateEmail = /\S+@\S+\.\S+/i;
	
	/* Compares two values for a match */
	function checkMatchingData(id1, id2) {
		var match,
		el1 = document.getElementById(id1),
		el2 = document.getElementById(id2);
		
		if(el1.value != el2.value) {
			match = false;
		} else {
			match = true;
		}
		
		/* Returns boolean */
		return match;
	}
	
	/* Validates a checked box */
	function isChecked(id) {
		var check = false,
		el = document.getElementById(id);
		
		if(el.checked === true) check = true;
		return check;
	}
	
	/* Validate string entries */
	function validateData (id, type) {	
		var el = document.getElementById(id),
		validate = RegExp();
		
		switch (type) {
			/* Allows alphabet values only */
			case 'name':
			validate = validateString;
			break;
			/* Allows numbers, hyphens, and parens only */
			case 'phone':
			validate = validatePhone;
			break;
			/* Allows five numbers only */
			case 'zip':
			validate = validateZip;
			break;
			/* Allows numbers followed by a string, will reject a PO box entry */
			case 'address':
			validate = validateAddress;
			break;
			/* Allows a 'x@x.x' format only */
			case 'email':
			validate = validateEmail;
			break;
			}
		
		/* Returns boolean */
		if(el.value != null) {
			return validate.test(el.value);
		} else {
			return false;
		}
		
	}
	
	function checkAllRequired($c) {
		var requiredItems = document.getElementsByClassName($c),
		requiredComplete = true;
		
		for (var i =0; i < requiredItems.length; i++) {
			if(requiredItems[i].value.length === 0) {
				requiredComplete = false;
				break;
				}
		}
		
		return requiredComplete;
	}
	
	return {
		match: checkMatchingData,
		checked: isChecked,
		validate: validateData,
		verify: checkAllRequired
	}
	
}();

