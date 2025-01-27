document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("buy1x").classList.add("active");
  updateUpgradeCosts(); // Opdater priser ved start
});



// Variabler
let money = 0;
let clickIncome = 1;
let autoIncome = 0;
let clickLevel = 1;
let autoIncomeLevel = 0;
let clickUpgradeCost = 10;
let autoIncomeUpgradeCost = 10;
let upgradeMode = "1x";

// Elementer
const moneyDisplay = document.getElementById("moneyDisplay");
const clickButton = document.getElementById("clickButton");
const clickUpgradeButton = document.getElementById("clickUpgradeButton");
const autoIncomeUpgradeButton = document.getElementById("autoIncomeUpgradeButton");
const clickUpgradeInfo = document.getElementById("clickUpgradeInfo");
const autoIncomeUpgradeInfo = document.getElementById("autoIncomeUpgradeInfo");
const toggleUpgradesButton = document.getElementById("toggleUpgradesButton");
const upgradeArea = document.getElementById("upgradeArea");

// Niveauvælger
document.querySelectorAll(".levelButton").forEach(button => {
  button.addEventListener("click", () => {
    upgradeMode = button.id.replace("buy", "").toLowerCase();
    document.querySelectorAll(".levelButton").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    updateUpgradeCosts(); // Opdater priser baseret på valgt mode
  });
});

// Klik for penge
clickButton.addEventListener("click", () => {
  money += clickIncome;
  updateUI();
});

// Opgrader Klik
clickUpgradeButton.addEventListener("click", () => {
  upgrade("click");
});

// Opgrader Automatisk Indkomst
autoIncomeUpgradeButton.addEventListener("click", () => {
  upgrade("autoIncome");
});

// Skift visning af opgraderingsområdet
toggleUpgradesButton.addEventListener("click", () => {
  upgradeArea.classList.toggle("hidden");
  toggleUpgradesButton.textContent = 
    upgradeArea.classList.contains("hidden") ? "Åbn Opgraderinger" : "Luk Opgraderinger";
});

// Opgraderingsfunktion
function upgrade(type) {
  let level, cost, currentIncome, newIncome;
  if (type === "click") {
    level = clickLevel;
    cost = clickUpgradeCost;
    currentIncome = clickIncome;
  } else {
    level = autoIncomeLevel;
    cost = autoIncomeUpgradeCost;
    currentIncome = autoIncome;
  }

  let levelsToBuy = calculateLevelsToBuy(level, cost);

  for (let i = 0; i < levelsToBuy; i++) {
    if (money >= cost) {
      money -= cost;
      level++;
      cost = Math.ceil(cost * 1.5);
    }
  }

  if (type === "click") {
    clickLevel = level;
    clickIncome = calculateIncome(clickLevel);
    clickUpgradeCost = cost;
    newIncome = clickIncome;
  } else {
    autoIncomeLevel = level;
    autoIncome = calculateIncome(autoIncomeLevel);
    autoIncomeUpgradeCost = cost;
    newIncome = autoIncome;
  }

  updateUI();
}

// Beregn antal niveauer at købe
function calculateLevelsToBuy(level, cost) {
  if (upgradeMode === "1x") return 1;
  if (upgradeMode === "10x") return 10;
  if (upgradeMode === "next") return getNextMilestone(level) - level;
  if (upgradeMode === "max") return Math.max(1, calculateMaxAffordableLevels(cost));
}

// Beregn maks niveauer, man har råd til
function calculateMaxAffordableLevels(cost) {
  let levels = 0;
  let tempMoney = money;
  while (tempMoney >= cost) {
    tempMoney -= cost;
    cost = Math.ceil(cost * 1.5);
    levels++;
  }
  return levels;
}

// Beregn næste milepæl
function getNextMilestone(level) {
  const milestones = [10, 25, 50, 100];
  return milestones.find(milestone => milestone > level) || level + 10;
}

// Beregn ny indkomst
function calculateIncome(level) {
  return level * 2; // Forenklet eksempel
}

// Opdater brugerfladen
function updateUI() {
  moneyDisplay.textContent = `Penge: ${money}`;
  clickUpgradeInfo.textContent = `Niveau: ${clickLevel}`;
  autoIncomeUpgradeInfo.textContent = `Niveau: ${autoIncomeLevel}`;
  updateUpgradeCosts(); // Opdater priser i UI
}

// Opdater priser for opgraderingsknapper
function updateUpgradeCosts() {
  const clickCost = calculateTotalUpgradeCost(clickUpgradeCost, clickLevel, upgradeMode);
  const autoCost = calculateTotalUpgradeCost(autoIncomeUpgradeCost, autoIncomeLevel, upgradeMode);

  const clickIncomeAfter = calculateIncome(clickLevel + calculateLevelsToBuy(clickLevel, clickUpgradeCost));
  const autoIncomeAfter = calculateIncome(autoIncomeLevel + calculateLevelsToBuy(autoIncomeLevel, autoIncomeUpgradeCost));

  // Opdatering af knapperne uden at ændre layoutet
  clickUpgradeButton.innerHTML = `Opgrader Klik ${clickCost} Credits <br> (${clickIncome} >>> ${clickIncomeAfter})`;
  autoIncomeUpgradeButton.innerHTML = `Opgrader Automatisk Indkomst ${autoCost} Credits <br> (${autoIncome} >>> ${autoIncomeAfter})`;
}


// Beregn total pris for opgraderinger baseret på mode
function calculateTotalUpgradeCost(baseCost, level, mode) {
  let totalCost = 0;
  let tempCost = baseCost;

  if (mode === "1x") {
    return baseCost;
  } else if (mode === "10x") {
    for (let i = 0; i < 10; i++) {
      totalCost += tempCost;
      tempCost = Math.ceil(tempCost * 1.5);
    }
  } else if (mode === "next") {
    const levelsToNext = getNextMilestone(level) - level;
    for (let i = 0; i < levelsToNext; i++) {
      totalCost += tempCost;
      tempCost = Math.ceil(tempCost * 1.5);
    }
  } else if (mode === "max") {
    let tempMoney = money;
    let boughtAtLeastOne = false; // Minimum én opgradering
    while (tempMoney >= tempCost) {
      boughtAtLeastOne = true;
      totalCost += tempCost;
      tempMoney -= tempCost;
      tempCost = Math.ceil(tempCost * 1.5);
    }
    if (!boughtAtLeastOne) totalCost = baseCost; // Minimumpris
  }

  return totalCost;
}
