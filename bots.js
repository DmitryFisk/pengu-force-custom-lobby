const bots = [];

async function loadAvailableBots() {
    const availableBotsRequest = await fetch(`/lol-lobby/v2/lobby/custom/available-bots`);
    const availableBots = await availableBotsRequest.json();

    availableBots.forEach((b) => {
        bots.push({ championId: b.id, botDifficulty: "RSINTERMEDIATE" });
    });
}

async function add(amount) {
    if (bots.length < 1) await loadAvailableBots();

    let teamASize = 1, teamBSize, requestBody, sideA = false;

    for (let i = 0; i < amount * 2 - 1; i++) {
        requestBody = bots[Math.floor(Math.random() * bots.length)];
        requestBody.botUuid = "7dcac880-d728-11ef-a177-03dba18923e5"; // might break in future

        if (sideA && teamASize < 5) {
            requestBody.teamId = "100";

            await fetch(`/lol-lobby/v1/lobby/custom/bots`, {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            teamASize++;
            sideA = false;
        } else {
            requestBody.teamId = "200";
            
            await fetch(`/lol-lobby/v1/lobby/custom/bots`, {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            teamBSize++;
            sideA = true;
        }
    }
}

export default {
    add: add
}