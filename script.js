const Game = (function() {
  // Cached references
  const rowInputLabel = document.getElementById('rowInputLabel');
  const rowInput = document.getElementById('rowInput');
  const startBtn = document.getElementById('startBtn');
  const errorMsg = document.getElementById('errorMsg');
  const gameArea = document.getElementById('gameArea');
  const playerChoiceLabel = document.getElementById('playerChoiceLabel');
  const select = document.getElementById('playerChoice');
  const playRoundBtn = document.getElementById('playRoundBtn');
  const roundTitle = document.getElementById('roundTitle');
  const playerMessage = document.getElementById('playerChoiceMessage');
  const computerMessage = document.getElementById('computerChoiceMessage');
  const roundResultMessage = document.getElementById('roundResultMessage');
  const overallWinnerMessage = document.getElementById('overallWinnerMessage');
  const tableBody = document.getElementById('tableBody');
  const playerTotalElem = document.getElementById('playerTotal');
  const computerTotalElem = document.getElementById('computerTotal');
  const resetBtn = document.getElementById('resetBtn');
  const scoreTable = document.getElementById('scoreTable');

  // Game state variables
  let maxRounds = 5;
  let roundNumber = 0;
  let playerTotalScore = 0;
  let computerTotalScore = 0;
  let gameActive = false;

  // Utility function
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function getRoundResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return "It's a draw!";
    switch (playerChoice) {
      case 'rock': return computerChoice === 'scissors' ? 'You win!' : 'Computer wins!';
      case 'paper': return computerChoice === 'rock' ? 'You win!' : 'Computer wins!';
      case 'scissors': return computerChoice === 'paper' ? 'You win!' : 'Computer wins!';
      default: return 'Invalid choices!';
    }
  }

  function updateScores(roundResult) {
    let playerScore = 0, computerScore = 0;
    if (roundResult === 'You win!') playerScore = 1;
    else if (roundResult === 'Computer wins!') computerScore = 1;
    playerTotalScore += playerScore;
    computerTotalScore += computerScore;
    return { playerScore, computerScore };
  }

  function addRoundToTable(round, playerChoice, computerChoice, playerScore, computerScore) {
    const row = document.createElement('tr');
    if (round % 2 === 0) row.classList.add('even-row');
    row.innerHTML = `
      <td>${round}</td>
      <td>${capitalize(playerChoice)}</td>
      <td>${capitalize(computerChoice)}</td>
      <td>${playerScore}</td>
      <td>${computerScore}</td>
    `;
    tableBody.appendChild(row);

    playerTotalElem.textContent = playerTotalScore;
    computerTotalElem.textContent = computerTotalScore;
  }

  function checkGameOver() {
    if (roundNumber >= maxRounds) {
      gameActive = false;
      select.disabled = true;
      playerChoiceLabel.style.display = 'none';
      select.style.display = 'none';
      // Clear previous round result messages and play round button
      playRoundBtn.style.display = 'none';
      computerMessage.textContent = "";
      playerMessage.textContent = "";
      roundTitle.textContent = "";
      roundResultMessage.textContent = "";
      // Declare overall winner
      if (playerTotalScore > computerTotalScore) {
        overallWinnerMessage.textContent = '🎉 You are the overall winner! 🎉';
      } else if (computerTotalScore > playerTotalScore) {
        overallWinnerMessage.textContent = '💻 Computer wins the game! 💻';
      } else {
        overallWinnerMessage.textContent = "🤝 It's an overall draw! 🤝";
      }
      resetBtn.style.display = 'inline-block';
      return true;
    }
    return false;
  }

  function playRound() {
    if (!gameActive) return;

    const playerChoice = select.value;
    if (!playerChoice) {
      playerMessage.textContent = '';
      computerMessage.textContent = '';
      roundTitle.textContent = '';
      roundResultMessage.textContent = '';
      return;
    }
    if (scoreTable.style.display === "none") {
  scoreTable.style.display = "table";
    }
    rowInput.style.display = 'none';
    startBtn.style.display= 'none';
    const computerChoice = getComputerChoice();
    const roundResult = getRoundResult(playerChoice, computerChoice);
    const { playerScore, computerScore } = updateScores(roundResult);

    roundNumber++;
    roundTitle.textContent = `Round ${roundNumber} of ${maxRounds}`;
    roundTitle.style.fontWeight = '800';
    playerMessage.textContent = `You have chosen ${capitalize(playerChoice)}.`;
    computerMessage.textContent = `Computer has chosen ${capitalize(computerChoice)}.`;
    roundResultMessage.textContent = roundResult;

    addRoundToTable(roundNumber, playerChoice, computerChoice, playerScore, computerScore);

    checkGameOver();
  }

  function resetGame() {
    roundNumber = 0;
    playerTotalScore = 0;
    computerTotalScore = 0;
    gameActive = false;

    select.value = '';
    select.style.display = 'none';
    playerMessage.textContent = '';
    computerMessage.textContent = '';
    roundTitle.textContent = '';
    roundResultMessage.textContent = '';
    overallWinnerMessage.textContent = '';
    playerTotalElem.textContent = '0';
    computerTotalElem.textContent = '0';
    resetBtn.style.display = 'none';

    tableBody.innerHTML = '';    // Hide the table on reset/game start
    playRoundBtn.style.display = 'inline-block';
    scoreTable.style.display = 'none';
    gameArea.style.display = 'none';
    rowInputLabel.style.display = 'flex';
    rowInput.style.display = 'flex';
    startBtn.style.display = 'inline-block';
  }

  function startGame() {
    const rounds = parseInt(rowInput.value, 10);
    if (isNaN(rounds) || rounds < 1 || rounds > 10) {
      errorMsg.textContent = 'Please enter a valid number between 1 and 10.';
      return;
    }
    errorMsg.textContent = '';
    maxRounds = rounds;
    roundNumber = 0;
    playerTotalScore = 0;
    computerTotalScore = 0;
    gameActive = true;

    playerChoiceLabel.style.display = 'flex';
    select.disabled = false;
    select.style.display = 'flex';
    select.value = '';

    playerMessage.textContent = '';
    computerMessage.textContent = '';
    roundTitle.textContent = '';
    roundResultMessage.textContent = '';
    overallWinnerMessage.textContent = '';
    playerTotalElem.textContent = '0';
    computerTotalElem.textContent = '0';
    tableBody.innerHTML = '';
    resetBtn.style.display = 'none';
    gameArea.style.display = 'flex';
    scoreTable.style.display = 'none';

    rowInput.style.display = 'none';
    startBtn.style.display = 'none';
    rowInputLabel.style.display = 'none';
    playerChoiceLabel.style.display = 'flex';
    select.focus();
  }

  function init() {
    rowInput.focus();
    startBtn.addEventListener('click', startGame);
    playRoundBtn.addEventListener('click', playRound); // new event
    resetBtn.addEventListener('click', resetGame);
    resetGame();
}

  return {
    init
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
