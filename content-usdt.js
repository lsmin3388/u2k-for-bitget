(() => {
    let currentExchangeRate = 1300;
    let observer = null;
    let parentContainer = null;

    const initExchangeRate = () => {
        chrome.storage.sync.get(["u2k_exchangeRate"], (result) => {
            currentExchangeRate = typeof result.u2k_exchangeRate === "number" ? result.u2k_exchangeRate : 1300;
            initObserver();
        });
    };

    const initObserver = () => {
        parentContainer = document.querySelector(".Fxik2p5xjHOekvHrD92i");
        if (!parentContainer) return;

        observer = new MutationObserver(updatePriceDisplay);
        observer.observe(parentContainer, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        updatePriceDisplay();
    };

    const updatePriceDisplay = () => {
        if (!parentContainer) return;

        const priceLi = parentContainer.querySelector("li");
        if (!priceLi) return;

        const usdText = priceLi.firstChild?.textContent?.trim();
        if (!usdText) return;

        const usdValue = parseFloat(usdText.replace(/,/g, ""));
        if (isNaN(usdValue)) return;

        priceLi.style.display = "flex";
        priceLi.style.flexDirection = "column";
        priceLi.style.alignItems = "flex-start";

        const krwValue = (usdValue * currentExchangeRate).toLocaleString();

        let krwInfo = priceLi.querySelector(".my-krw-info");
        if (!krwInfo) {
            krwInfo = document.createElement("div");
            krwInfo.classList.add("my-krw-info");

            krwInfo.style.fontSize = "12px";
            krwInfo.style.color = "var(--content-tertiary, #898989)";
            krwInfo.style.marginTop = "2px";

            priceLi.appendChild(krwInfo);
        }

        krwInfo.textContent = `≈ ${krwValue} KRW`;
    };

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "sync" && changes.u2k_exchangeRate?.newValue) {
            currentExchangeRate = changes.u2k_exchangeRate.newValue;
            updatePriceDisplay();
        }
    });

    initExchangeRate();
})();
