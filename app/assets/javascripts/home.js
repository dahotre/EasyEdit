var KEYS = {
    UNKNOWN: 0,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DEL: 46,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    COMMA: 188,
    PAGEUP: 33,
    PAGEDOWN: 34,
    BACKSPACE: 8,
    SPACE: 32
};
values = [];
i = 0;
jsonData = new Object();
startIndex = -1;
endIndex = -1;

$(function () {

    $('#textarea').keyup(function (event) {
        if ( event.ctrlKey && event.keyCode == KEYS.SPACE ) {

            var allText = $(this).val();
            resetVars();

            $.getJSON('', { allText: allText}, function (data) {
                var options = [];
                jsonData = data;

                var valueIndex = 0;
                $.each(data, function (key, valueArray) {
                    $.each(valueArray, function(k, v){
                        options.push('<option value="' + valueIndex++ + '" >' + v + '</option>');
                        values.push(v);
                    });
                });

                $('#options').html(options);
                console.log(values);
                triggerUpdate();
                console.log('i : ' + i);

            });
        }
        else if (event.keyCode == KEYS.DOWN) {
            if (i > 0 ) {
                triggerUpdate();
                event.preventDefault();
            }
        }

    });

    $('#textarea').keydown(function(event) {
        if(event.keyCode == KEYS.DOWN || (event.ctrlKey && event.keyCode == KEYS.SPACE) ) {
            console.log('do nothing');
        }
        else {
            if (i > 0 && (event.keyCode == KEYS.RETURN || event.keyCode == KEYS.RIGHT) ) {
                event.preventDefault();
                event.stopPropagation();
                resetVars();
            }
        }
    });

    var triggerUpdate = function() {
        var localIterator = 0;
        $.each(jsonData, function(key, valueArray) {
            var doBreak = false;
            $.each(valueArray, function(index, value) {
                if (localIterator < i) {
                    //do nothing
                }
                else {

                    startIndex = (startIndex == -1) ? ($('#textarea').getSelection().start - key.length) : startIndex;
                    endIndex = (endIndex == -1) ? startIndex + key.length : endIndex;

                    $('#textarea').selectRange(startIndex, endIndex);

                    updateSelection($('#textarea'), key, value);
                    updateListSelection($('#options'), i);
                    i++;
                    doBreak = true;
                    return false;
                }
                localIterator++;
            });
            if (doBreak) {
                return false;
            }
        });
    };


    var updateSelection = function (area, chunk, completion) {
        if (completion) {
            var _selectionStart = area.getSelection().start,
                _selectionEnd = _selectionStart + completion.length;

            startIndex = _selectionStart;
            endIndex = _selectionEnd;

            if (area.getSelection().text === "") {
//                if (area.val().length === _selectionStart) { // Weird IE workaround, I really have no idea why it works
//                    area.setCaretPos(_selectionStart + 10000);
//                }
                area.insertAtCaretPos(completion);
            } else {
                area.replaceSelection(completion);
            }

            area.selectRange(_selectionStart, _selectionEnd);
        }
    };

    var updateListSelection = function(listElement, index) {
        listElement.val([index]);
    }

    $.fn.selectRange = function(start, end) {
        if(!end) end = start;
        return this.each(function() {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

    var resetVars = function() {
        i=0;
        values=[];
        jsonData = new Object();
        startIndex = -1;
        endIndex = -1;
        $('#options').html('');
    };

});