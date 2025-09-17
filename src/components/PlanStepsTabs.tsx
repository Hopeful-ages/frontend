// planStepsTabs.js
const readline = require("readline");

const steps = ["antes", "durante", "depois"];
let currentStep = "antes";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\nEtapas do plano:");
  steps.forEach((s) => {
    console.log(s === currentStep ? ` [${s}] (ativo)` : `   ${s}`);
  });

  rl.question("Digite a etapa (antes, durante, depois): ", (answer) => {
    if (steps.includes(answer)) {
      currentStep = answer;
      console.log(`\nVocê mudou para a etapa: ${currentStep}`);
    } else {
      console.log("Etapa inválida!");
    }
    showMenu();
  });
}

showMenu();
