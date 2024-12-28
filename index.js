import "./assets/styles.css";

export function load() {
    appendButton();
}

function appendButton() {
    setInterval(() => {
        const navbarContainer = document.querySelector(".navigation-root-component");

        if (navbarContainer && !document.querySelector(".force-custom-game")) {
            const rootDiv = document.createElement("div");
            const buttonDiv = document.createElement("div");
            const button = document.createElement("div");

            rootDiv.classList.add("navigation-status-ticker", "has-incidents", "ember-view")
            buttonDiv.classList.add("ticker-button", "force-custom-game");
            button.classList.add("ticker-toggle");

            buttonDiv.append(button);

            button.onclick = () => createLobby();

            rootDiv.append(buttonDiv);
            navbarContainer.insertBefore(rootDiv, document.querySelector(".navigation-status-ticker"));
        }
    }, 100);
}


async function createLobby() {
    const requestBody = {
        customGameLobby: {
            configuration: {
                gameMode: "PRACTICETOOL",
                gameMutator: "",
                gameServerRegion: "",
                mapId: 11,
                mutators: { id: 1 },
                spectatorPolicy: "AllAllowed",
                teamSize: 1,
            },
            lobbyName: `YOU'LL NEVER SEE IT COMING`,
            lobbyPassword: ""
        },
        isCustom: true
    }

    const res = await fetch("/lol-lobby/v2/lobby", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();
    
    if (data && data.canStartActivity) return await fetch(`/lol-lobby/v1/lobby/custom/start-champ-select`, { method: "POST" });
}
