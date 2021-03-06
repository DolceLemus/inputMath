(function(){

    function loader($) {

        $.fn.mathEval = function(text) {
            /** As we are running unsafe code from the user, we should allow only a limited set of
            * characters, try this regex in: https://regex101.com/
            **/
            var regex = /^[0-9\.\+\-\(\)\/\* \t]*$/gm;
            if (regex.exec(text) == null) {
                throw new SyntaxError('Invalid Characters');
            }
            try {
                /** Instead of eval, we use the alternative given by MDN:
                * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
                **/
                return Function('"use strict";return (' + text + ')')();
            } catch (e) {
                /** We might still have wrong syntax even with the limited set of character ((((4..4+45) **/
                throw new SyntaxError('Wrong Syntax');
            }
        };
        
        $.fn.inputMath = function() {
            this.filter('input[type="text"]').each(function() {
                $(this).on('keyup',(event)=>{
                    var $target = $(event.target);
                    if (event.which == 13) {
                        //console.log("Evaluating:"+$target.val() );
                        var new_value = "";
                        try {
                            new_value = $.fn.mathEval($target.val());
                        } catch(e) {
                            new_value = $target.val();
                        }
                        $target.val(new_value);
                    } else {
                        //We don't change anything
                        //console.log($target.val());
                    }
                });
                
            });
            
            return this;
        };
        
    }

    if (typeof window =='undefined'){ 
        module.exports = function(jQuery){
            /** Loading for Node **/
            loader(jQuery);
            return jQuery;
        };
    } else {
        /** Loading for Browser **/
        loader(jQuery);
    }

})();