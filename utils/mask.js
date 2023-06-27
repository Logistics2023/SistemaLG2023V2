function applyInputMask(elementId, mask) {
    let inputElement = document.getElementById(elementId);
    let content = '';
    let maxChars = numberCharactersPattern(mask);
    
    inputElement.addEventListener('keydown', function(e) {
      e.preventDefault();
      if (isNumeric(e.key) && content.length < maxChars) {
        content += e.key;
      }
      if(e.keyCode == 8) {
        if(content.length > 0) {
          content = content.substr(0, content.length - 1);
        }
      }
      inputElement.value = maskIt('0--0*0 000_000', content);
    })
  }



  function maskIt(pattern, value) {
    let position = 0;
    let currentChar = 0;
    let masked = '';
    while(position < pattern.length && currentChar < value.length) {
      if(pattern[position] === '0') {
        masked += value[currentChar];
        currentChar++;
      } else {
        masked += pattern[position];
      }
      position++;
    }
    return masked;
  }



  function numberCharactersPattern(pattern) {
    let numberChars = 0;
    for(let i = 0; i < pattern.length; i++) {
      if(pattern[i] === '0') {
        numberChars ++;
      }
    }
    return numberChars;
  }


  export { applyInputMask }