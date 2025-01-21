import "./assets/styles.css";
import CustomGameSettings from "./ui";
import bots from "./bots";

class CustomGameButton {
    constructor() {
        this.observer = null;
        this.button = null;
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        this.observer = new MutationObserver(() => {
            if (!this.button) this.tryAppendButton();
        });

        const target = document.body;
        this.observer.observe(target, { 
            childList: true, 
            subtree: true 
        });
    }

    tryAppendButton() {
        const navMenu = document.querySelector(".left-nav-menu");
        if (!navMenu || document.querySelector(".force-custom-game")) return;

        this.button = this.createButtonElement();
        navMenu.insertBefore(this.button, navMenu.firstChild);
    }

    createButtonElement() {
        const rootDiv = document.createElement("div");
        const buttonDiv = document.createElement("div");
        const button = document.createElement("div");

        rootDiv.className = "navigation-status-ticker has-incidents ember-view";
        buttonDiv.className = "ticker-button force-custom-game";
        button.className = "ticker-toggle";

        buttonDiv.addEventListener("click", () => createLobby());
        
        buttonDiv.append(button);
        rootDiv.append(buttonDiv);
        return rootDiv;
    }
}

async function createLobby() {
    const botsAmount = DataStore.get("fcg-bots-amount");

    try {
        const requestBody = {
            customGameLobby: {
                configuration: {
                    gameMode: "PRACTICETOOL",
                    gameMutator: "",
                    gameServerRegion: "",
                    mapId: 11,
                    mutators: { id: 1 },
                    spectatorPolicy: "AllAllowed",
                    teamSize: botsAmount == 0 ? 1 : botsAmount,
                },
                lobbyName: `YOU'LL NEVER SEE IT COMING`,
                lobbyPassword: ""
            },
            isCustom: true
        };

        const res = await fetch("/lol-lobby/v2/lobby", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        if (data && data.canStartActivity) {
            if (botsAmount > 0) await bots.add(botsAmount)

            await fetch("/lol-lobby/v1/lobby/custom/start-champ-select", { 
                method: "POST" 
            });
        }
    } catch (error) {
        console.error(`Failed to create lobby: ${error}`);
    }
}

export function load() {
    const customGameButton = new CustomGameButton();
    const customGameSettings = new CustomGameSettings();
    customGameButton.init();
    customGameSettings.init();

    if (!DataStore.has("fcg-bots-amount")) DataStore.set("fcg-bots-amount", 0);
}