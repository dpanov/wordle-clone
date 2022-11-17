const state = {
  word: '',
  currenRowIndex: 1,
  currentColumnIndex: 1,
}

fetch('https://words.dev-apis.com/word-of-the-day')
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    document.getElementById('main').classList.remove('is-loading');
    state.word = data.word;
  });

document.addEventListener('keydown', function (event) {
  const key = event.key;

  if (key === "Enter") {
    handleEnter(state.currentRowIndex, state.word);
  } else if (key === "Backspace") {
    event.preventDefault();
    handleBackspace({currentRowIndex: state.currentRowIndex, currentColumnIndex: state.currentColumnIndex});
  } 
});

document.querySelectorAll('input').forEach((input) => {
  // Clear values, because the browser saves them after refresh
  input.value = '';

  input.addEventListener('input', handleInput);
  input.addEventListener('focus', handleFocus);
});

function handleInput(event) {
  event.preventDefault();
  
  if (!isLetter(event.data)) {
    return;
  }
  
  event.target.value = event.data;
  focusNextInput(event.target);
}

function handleFocus(event) {
  const focusedElement = event.target;
  state.currentRowIndex = focusedElement.parentElement.dataset.row;
  state.currentColumnIndex = focusedElement.dataset.col;
}

function handleEnter(currentRowIndex, word) {
  const currentRow = document.querySelector(`#row-${currentRowIndex}`);
  const inputs = currentRow.querySelectorAll('input');
  const wordLength = word.length;

  if (!inputs[wordLength - 1].value) {
    return alert('Short word');
  }
  
  inputs.forEach((input, index) => {
    const value = input.value;

    if (value === word[index]) {
      input.classList.add('win');
    } else if (value && word.includes(value)) {
      input.classList.add('included');
    } else {
      input.classList.add('nope');
    }
  });
  
  // Win condition
  if (currentRow.querySelectorAll('.win').length === wordLength) {
    alert('you win!');
  } else {
    focusNextRow(currentRow);
  }
}

function handleBackspace({currentRowIndex, currentColumnIndex}) {
  const currentInput = document.querySelector(`#row-${currentRowIndex} [data-col="${currentColumnIndex}"]`);
  currentInput.value = '';
  focusPreviousInput(currentInput);
}

function focusNextRow(currentRow) {
  const nextRow = currentRow?.nextElementSibling;
  
  if (nextRow) {
    nextRow.querySelector('input').focus();
  } else {
    alert('You lose, try again');
  }
}

function focusNextInput(currentInput) {
  const nextElement = currentInput?.nextElementSibling;
  
  if (nextElement) {
    nextElement.focus();
  }
}

function focusPreviousInput(currentInput) {
  const previousElement = currentInput?.previousElementSibling;
  
  if (previousElement) {
    previousElement.focus();
  }
}

function isLetter(character) {
  return /^[a-zA-Z]$/.test(character);
}