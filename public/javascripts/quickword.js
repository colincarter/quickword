(() => {
  const quickWord = () => {
    let canvas,
      context,
      t,
      st,
      ft, // Timeouts
      words,
      maxWords,
      x = -30,
      delay = 30,
      currentWord = 0,
      success = false,
      successCount = 0,
      wordPos = 0;

    const nextWord = () => {
      x = -10;
      success = false;
      wordPos = 0;

      if (++currentWord >= maxWords) {
        currentWord = 0;
      }

      setDelayForWord();
    };

    const setDelayForWord = () => {
      if (words[currentWord].length > 6) {
        delay = 30;
      } else {
        delay = 20;
      }
    };

    const clearCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
    };

    const scrollText = () => {
      x++;

      clearCanvas();
      context.translate(x, canvas.height / 2);
      context.fillText(words[currentWord], 0, 0);
      context.restore();

      // If the end of the word reaches the right-hand edge of the canvas
      // then reset things
      if (
        x + context.measureText(words[currentWord]).width >=
        canvas.width + 30
      ) {
        nextWord();
      }

      t = setTimeout(() => {
        scrollText();
      }, delay);
    };

    const updateSuccessDisplay = () => {
      document.getElementById("success").innerHTML = "Wins: " + successCount;
    };

    const showSuccess = () => {
      clearTimeout(t);
      clearTimeout(st);

      successCount++;

      clearCanvas();
      updateSuccessDisplay();

      context.fillText("Success", canvas.width / 2, canvas.height / 2);

      st = setTimeout(() => {
        nextWord();
        scrollText();
      }, 500);
    };

    const showFail = () => {
      clearTimeout(t);
      clearTimeout(ft);

      clearCanvas();
      context.fillText("Fail", canvas.width / 2, canvas.height / 2);

      ft = setTimeout(function() {
        nextWord();
        scrollText();
      }, 500);
    };

    const onKeyPress = e => {
      const keyChar = String.fromCharCode(e.keyCode || e.charCode);

      if (words[currentWord].charAt(wordPos) == keyChar) {
        wordPos++;
        success = true;
      } else {
        success = false;
        showFail();
      }

      if (success && wordPos >= words[currentWord].length) {
        showSuccess();
      }

      return false;
    };

    const initKeyboardEvents = () => {
      window.onkeypress = onKeyPress;
    };

    const withWords = callback => {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          words = JSON.parse(xmlHttp.responseText);
          maxWords = words.length;
          callback();
        }
      };
      xmlHttp.open("GET", "words", false);
      xmlHttp.send();
    };

    withWords(function() {
      canvas = document.getElementById("can");
      context = canvas.getContext("2d");

      context.fillStyle = "blue";
      context.font = "18px Verdana";
      context.textAlign = "center";
      context.textBaseLine = "middle";

      updateSuccessDisplay();

      initKeyboardEvents();

      setDelayForWord();

      scrollText();
    });
  };

  document.addEventListener("DOMContentLoaded", quickWord);
})();
