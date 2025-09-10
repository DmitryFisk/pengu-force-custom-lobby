const bots = [];

async function loadAvailableBots() {
    const availableBotsRequest = await fetch(`/lol-lobby/v2/lobby/custom/available-bots`);
    const availableBots = await availableBotsRequest.json();

    availableBots.forEach((b) => {
        bots.push({ championId: b.id, botDifficulty: "RSINTERMEDIATE", botUuid: "ca50e3ff-84d3-45bc-8338-c01db0ef259a", isBot: true });
    });
}

async function add(amount) {
    if (bots.length < 1) await loadAvailableBots();

    let teamA = [0], teamB = [], sideA = false;

    for (let i = 0; i < amount * 2 - 1; i++) {
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        
        if (sideA && teamA.length < 5) {
            teamA.push({ ...randomBot, teamId: "100" });

            sideA = false;
        } else {
            teamB.push({ ...randomBot, teamId: "200" });

            sideA = true;
        }
    }

    return [teamA, teamB];
}

export default {
    add: add
}