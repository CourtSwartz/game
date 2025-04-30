let cause = '';
let hero = '';
let points = 0;
let bank = 2000;
let battery = 50;
let legalProgress = 0;
let communitySupport = 0;
let totalFailures = 0;

function updateStats() {
  const getBar = (label, value, max, barClass) => `
    <div class="stat-group">
      <span class="stat-label">${label}: ${value} / ${max}</span>
      <div class="stat-bar-container">
        <div class="stat-bar ${barClass}" style="width: ${Math.min((value / max) * 100, 100)}%">
          ${value}
        </div>
      </div>
    </div>`;

  document.getElementById('header').innerHTML = `
    <h2>${hero} fights for ${cause}</h2>
    ${getBar('💬 Political Power', points, 25, 'bar-points')}
    ${getBar('⚖️ Legal Progress', legalProgress, 25, 'bar-legal')}
    ${getBar('🫂 Community Support', communitySupport, 25, 'bar-community')}
    <p style="font-size: 16px;"><strong>❌ Failures: ${totalFailures} / 20</strong></p>
  `;

  document.getElementById('quick-bars').innerHTML = `
    ${getBar('🔋 Energy', battery, 50, 'bar-energy')}
    ${getBar('💵 Bank', bank, 2000, 'bar-bank')}
  `;
}

function chooseCause(selectedCause) {
    cause = selectedCause;
  
    // Hide intro screen and show hero selection screen
    document.getElementById('intro-screen').classList.add('hide');
    document.getElementById('hero-selection-screen').classList.remove('hide');
  
    // Update cause label
    document.getElementById('hero-selection-cause').innerHTML = `You chose: <strong>${cause}</strong>`;
  }

  function chooseHero(selectedHero) {
    hero = selectedHero;
  
    // Hide hero selection screen
    document.getElementById('hero-selection-screen').classList.add('hide');
  
    // Show game container
    document.getElementById('game-container').classList.remove('hide');
  
    // Apply stat bonus based on hero
    if (hero === 'Dante') legalProgress += 5;
    if (hero === 'Amira') communitySupport += 5;
    if (hero === 'Maya') points += 5;
    if (hero === 'Leo') battery += 5;
  
    // Set character image
    const characterImg = {
      Amira: "images/characters/amira.png",
      Dante: "images/characters/dante.png",
      Maya: "images/characters/maya.png",
      Leo: "images/characters/leo.png"
    };
  
    document.getElementById('character-image').innerHTML = `
      <img src="${characterImg[selectedHero]}" alt="${selectedHero}" style="width: 100%; max-width: 200px; border-radius: 10px;">
    `;
  
    // Show win/loss info and restart button
    document.getElementById('win-loss-info').style.display = "block";
    document.getElementById('restart-button').style.display = "block";
  
    // Update stats and show game options
    updateStats();
    showMainOptions();
  }

function showMainOptions() {
  document.getElementById('game').innerHTML = `
    <p>Choose your action:</p>
    <button onclick="chooseMissionType('points')">🏛 Political Action</button>
    <button onclick="chooseMissionType('legal')">⚖️ Legal Mission</button>
    <button onclick="chooseMissionType('community')">🫂 Community Work</button>
    <br><br>
    <button onclick="fundraise()">💰 Fundraise</button>
    <button onclick="rest()">🛌 Rest</button>
    <button onclick="openFoodMenu()">🍴 Eat Food</button>
  `;
}

function chooseMissionType(type) {
  if (battery < 10 || bank < 50) {
    updateStats();
    document.getElementById('game').innerHTML = `
      <p class="failure">You don’t have enough energy or money. (10 energy & $50 needed)</p>
      <button onclick="showMainOptions()">Back</button>
    `;
    return;
  }

  const allMissions = {
    points: ["Negotiate with city officials", "Run a social media campaign", "Speak at a rally"],
    legal: ["Defend a tenant in court", "Challenge a local policy in court"],
    community: ["Organize a protest", "Hold a teach-in", "Plan a coalition meeting", "Record a podcast episode"]
  };

  const missions = allMissions[type];
  const missionText = missions[Math.floor(Math.random() * missions.length)];
  const roll = Math.floor(Math.random() * 10) + 1;
  const success = roll <= 5;
  battery -= 10;
  bank -= 50;

  let resultText = `<strong>Mission:</strong> ${missionText}<br>You spent $50 and 10 energy.<br>`;

  if (success) {
    if (type === "points") { points += 5; resultText += "You gained +5 Political Power."; }
    if (type === "legal") { legalProgress += 3; resultText += "You gained +3 Legal Progress."; }
    if (type === "community") { communitySupport += 3; resultText += "You gained +3 Community Support."; }
  } else {
    resultText += "<span class='failure'>Mission Failed.</span> You lost $100.<br>";
    bank = Math.max(0, bank - 100);
    totalFailures++;
  }

  if (checkEndGame()) return;
  updateStats();
  document.getElementById('game').innerHTML = `
    <p>${resultText}</p>
    <button onclick="showMainOptions()">Continue</button>
  `;
}

function fundraise() {
  if (battery < 5) {
    updateStats();
    document.getElementById('game').innerHTML = `
      <p class="failure">You’re too tired to fundraise. (5 energy needed)</p>
      <button onclick="showMainOptions()">Back</button>
    `;
    return;
  }
  battery -= 5;
  const raised = Math.floor(Math.random() * 200) + 100;
  bank += raised;

  updateStats();
  document.getElementById('game').innerHTML = `
    <p>You spent 5 energy and raised $${raised}.</p>
    <button onclick="showMainOptions()">Continue</button>
  `;
}

function rest() {
  if (bank < 10) {
    updateStats();
    document.getElementById('game').innerHTML = `
      <p class="failure">You can’t afford to rest. ($10 needed)</p>
      <button onclick="showMainOptions()">Back</button>
    `;
    return;
  }

  const recovered = Math.floor(Math.random() * 10) + 10;
  battery = Math.min(50, battery + recovered);
  bank -= 10;

  updateStats();
  document.getElementById('game').innerHTML = `
    <p>You rested and regained ${recovered} energy. It cost you $10.</p>
    <button onclick="showMainOptions()">Continue</button>
  `;
}

function openFoodMenu() {
  document.getElementById('game').innerHTML = `
    <p>What would you like to eat?</p>
    <button onclick="buyFood(5, 10)">🥪 Sandwich ($5, +10 energy)</button><br>
    <button onclick="buyFood(10, 25)">🍜 Ramen ($10, +25 energy)</button><br>
    <button onclick="buyFood(15, 50)">🍕 Pizza Feast ($15, +50 energy)</button><br>
    <button onclick="buyFood(3, 5)">☕ Coffee ($3, +5 energy)</button><br>
    <br>
    <button onclick="showMainOptions()">Back</button>
  `;
}

function buyFood(cost, energyGain) {
  if (bank < cost) {
    document.getElementById('game').innerHTML = `
      <p class="failure">Not enough money for this item.</p>
      <button onclick="openFoodMenu()">Back</button>
    `;
    return;
  }
  bank -= cost;
  battery = Math.min(50, battery + energyGain);
  updateStats();
  document.getElementById('game').innerHTML = `
    <p>You bought food for $${cost} and restored ${energyGain} energy.</p>
    <button onclick="showMainOptions()">Continue</button>
  `;
}

function checkEndGame() {
  if (points >= 25 && legalProgress >= 25 && communitySupport >= 25) {
    return endGame("You passed legislation, won in court, and built a movement! 🏆");
  }
  if (totalFailures >= 20) {
    return endGame("You’ve lost too much momentum and your movement fizzles out. ❌", true);
  }
  if (battery <= 0 && bank < 100) {
    return endGame("You burned out and couldn’t keep going. 💔", true);
  }
  if (bank <= -300) {
    return endGame("You ran out of resources and had to close shop. 🏚️", true);
  }
  return false;
}

function endGame(message, lost = false) {
    document.getElementById('header').innerHTML = message;
    document.getElementById('game').innerHTML = `
      <h1 style="font-size: 3em;">${lost ? 'You Lose.' : 'Victory Achieved!'}</h1>
      <p>${lost ? 'Try again with a new strategy!' : ''}</p>
      <p>Score: Political Power: ${points}, Legal: ${legalProgress}, Community: ${communitySupport}, Bank: $${bank}, Failures: ${totalFailures}</p>
      <button onclick="location.reload()">Play Again</button>
    `;
    return true;
  }
