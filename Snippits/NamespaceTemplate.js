//Template for jQuery scripts
//Call methods via ScriptName.init();
var ScriptName = ScriptName || {};

(function ($, ScriptName) {
  
  ScriptName.ClassName = ( function(){
    var $v;
    
    function init() {
      
    }
  
    return {
      init:init
    }
    
  })();
  
  Construct = (function(){
    $(document).ready(function(){
      ScriptName.ClassName.init();
    });
  })();
  
})(jQuery,ScriptName);