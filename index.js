import "./assets/styles.css";
import bots from "./bots";
import CustomGameSettings from "./ui";

const zhButtonAlternative = ["zh-CN", "zh-TW"]; // I'm sorry if this incorrect

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

    async tryAppendButton() {
        const navMenu = document.querySelector(".left-nav-menu");
        if (!navMenu || document.querySelector(".fcg-root")) return;

        this.button = await this.createButtonElement();
        if (this.button) navMenu.insertBefore(this.button, navMenu.firstChild);
    }

    async createButtonElement() {
        const locale = await getClientLocale();

        const rootDiv = document.createElement("div");
        const buttonDiv = document.createElement("div");
        const button = document.createElement("div");

        rootDiv.className = "navigation-status-ticker has-incidents ember-view fcg-root";
        buttonDiv.className = zhButtonAlternative.includes(locale) ? "ticker-button force-custom-game-zh" : "ticker-button force-custom-game";
        button.className = "ticker-toggle";

        buttonDiv.addEventListener("click", () => createLobby());

        buttonDiv.append(button);
        rootDiv.append(buttonDiv);

        if (document.querySelector(".fcg-root")) return null; // tldr: skill issue; this prevents button duplicating when league client is lagging af (for example when you reload it way too much times or smth else)

        return rootDiv;
    }
}

async function createLobby() {
    const botsAmount = DataStore.get("fcg-bots-amount");
    let botsArray;
    if (botsAmount > 0) botsArray = await bots.add(botsAmount);
    console.log(botsArray)

    try {
        const requestBody = {
            isCustom: true,
            queueId: 3140,
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
                lobbyPassword: "",
            },
            // teamOne: botsArray[0],
            // teamTwo: botsArray[1],
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
            await fetch("/lol-lobby/v1/lobby/custom/start-champ-select", {
                method: "POST"
            });
        }
    } catch (error) {
        console.error(`Failed to create lobby: ${error}`);
    }
}

export async function getClientLocale() {
    const localeRequest = await fetch(`/riotclient/region-locale`);
    const localeData = await localeRequest.json();

    if (localeData.locale) return localeData.locale;
}

export function load() {
    const customGameButton = new CustomGameButton();
    const customGameSettings = new CustomGameSettings();
    customGameButton.init();
    customGameSettings.init();

    if (!DataStore.has("fcg-bots-amount")) DataStore.set("fcg-bots-amount", 0);
}