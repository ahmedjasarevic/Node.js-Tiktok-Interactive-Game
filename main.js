// Fetch character health values from the backend and update the UI
async function updateCharacterHealth() {
  try {
    const response = await fetch("/character-health");
    const data = await response.json();

    document.getElementById("ronaldoHealth").textContent = data.ronaldoHealth;
    document.getElementById("messiHealth").textContent = data.messiHealth;
  } catch (error) {
    console.error("Error fetching character health:", error);
  }
}

// Periodically update character health
setInterval(updateCharacterHealth, 1000);
