class CustomGameSettings {
    constructor() {
        this.observer = null;
        this.settingsBotsAmountSelector = null;
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        this.observer = new MutationObserver(() => {
            if (!this.settingsBotsAmountSelector) {
                this.tryAppendSelector();
            } else if (!document.querySelector(".force-custom-game-bots-amount-div") && document.querySelector(".lol-settings-account-verification-row")) {
                document.querySelector(".lol-settings-options").children[0].insertBefore(this.settingsBotsAmountSelector, document.querySelectorAll(".lol-settings-general-row")[1]);
            }
        });

        const target = document.body;
        this.observer.observe(target, {
            childList: true,
            subtree: true
        });
    }

    tryAppendSelector() {
        const settingsElement = document.querySelector(".lol-settings-options");

        if (!settingsElement || !document.querySelector(".lol-settings-account-verification-row")) return this.settingsBotsAmountSelector = null;

        if (!document.querySelector(".force-custom-game-bots-amount-div")) {
            this.settingsBotsAmountSelector = this.createSelector();
            settingsElement.children[0].insertBefore(this.settingsBotsAmountSelector, document.querySelectorAll(".lol-settings-general-row")[1]);
        }
    }

    createSelector() {
        const dropdownDiv = document.createElement("div");
        const dropdownLabel = document.createElement("div");
        const dropdown = document.createElement("lol-uikit-framed-dropdown");

        dropdownDiv.classList.add("force-custom-game-bots-amount-div", "lol-settings-video-row");
        dropdownLabel.classList.add("lol-settings-window-size-text");
        dropdown.classList.add("lol-settings-window-size-dropdown");

        dropdownLabel.textContent = "Bots amount (on each team)";

        for (let i = 0; i < 6; i++) {
            const option = document.createElement("lol-uikit-dropdown-option");
            option.classList.add("framed-dropdown-type");
            option.textContent = i.toString();
            option.setAttribute("slot", "lol-uikit-dropdown-option");

            option.onclick = () => DataStore.set("fcg-bots-amount", i);

            if (DataStore.get("fcg-bots-amount") == i) option.setAttribute("selected", "true");

            dropdown.append(option);
        }

        dropdownDiv.append(dropdownLabel, dropdown);

        return dropdownDiv;
    }
}

export default CustomGameSettings
