window.quickWord = function() {
    var canvas, context,
        t, st, ft,          // Timeouts
        words,
        maxWords,
        x           = -30,
        delay       = 30,
        currentWord = 0,
        success     = false,
        successCount=0,
        wordPos     = 0;

    var nextWord = function() {
        x         = -10;
        success   = false;
        wordPos     = 0;

        if(++currentWord >= maxWords) {
           currentWord = 0;
       }

       setDelayForWord();
   };

    var setDelayForWord = function() {
        if(words[currentWord].length > 6) {
            delay = 30;
        } else {
            delay = 20;
        }
   };

   var clearCanvas = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
    };

    var scrollText = function() {
        x++;

        clearCanvas();
        context.translate(x, canvas.height/2);
        context.fillText(words[currentWord], 0, 0);
        context.restore();

        // If the end of the word reaches the right-hand edge of the canvas
        // then reset things
        if((x + context.measureText(words[currentWord]).width) >= canvas.width+30) {
            nextWord();
        }

        t = setTimeout(function() {
            scrollText();
        }, delay);
    };

    var updateSuccessDisplay = function() {
        document.getElementById('success').innerHTML = "Wins: " + successCount;
    }

    var showSuccess = function() {
        clearTimeout(t);
        clearTimeout(st);

        successCount++;

        clearCanvas();
        updateSuccessDisplay();

        context.fillText("Success", canvas.width/2, canvas.height/2);

        st = setTimeout(function() {
            nextWord();
            scrollText();
        }, 500);
    };

    var showFail = function() {
        clearTimeout(t);
        clearTimeout(ft);

        clearCanvas();
        context.fillText("Fail", canvas.width/2, canvas.height/2);

        ft = setTimeout(function() {
            nextWord();
            scrollText();
        }, 500);
    };

    var onKeyPress = function(e) {
        var keyChar = String.fromCharCode(e.keyCode || e.charCode);

        if(words[currentWord].charAt(wordPos) == keyChar) {
            wordPos++;
            success = true;
        } else {
            success = false;
            showFail();
        }

        if(success && wordPos >= words[currentWord].length) {
            showSuccess();
        }

        return false;
    };

    var initKeyboardEvents = function() {
        window.onkeypress = onKeyPress;
    };

    var withWords = function(callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                words = JSON.parse(xmlHttp.responseText);
                maxWords = words.length;
                callback();
            }
        }
        xmlHttp.open("GET", "words", false);
        xmlHttp.send();
    };

    return {
        run: function() {
            withWords(function() {
                canvas  = document.getElementById('can');
                context = canvas.getContext('2d');

                context.fillStyle       = 'blue';
                context.font            = "18px Verdana";
                context.textAlign       = "center";
                context.textBaseLine    = "middle";

                updateSuccessDisplay();

                initKeyboardEvents();

                setDelayForWord();

                scrollText();
            });
        }
    }
}();
