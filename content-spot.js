(function () {
    // console.log("[content-spot.js] loaded.");

    const pathParts = location.pathname.split("/");
    const spotIndex = pathParts.indexOf("spot");
    if (spotIndex === -1) return;
    const pair = pathParts[spotIndex + 1] || "";
    if (!pair.toUpperCase().includes("USDT")) return;

    // console.log(`[content-spot.js] Spot USDT pair detected: ${pair}`);

    let currentExchangeRate = 1300;
    let observer = null;
    let container = null;

    function initExchangeRate() {
        chrome.storage.sync.get(["u2k_exchangeRate"], (result) => {
            if (result.u2k_exchangeRate) {
                currentExchangeRate = result.u2k_exchangeRate;
            }
            initObserver();
        });
    }

    function initObserver() {
        container = document.querySelector(".RHLdJhiFsdXWCXga_SRH");
        if (!container) {
            // console.log("[content-spot.js] .RHLdJhiFsdXWCXga_SRH not found");
            return;
        }

        observer = new MutationObserver(() => {
            updatePriceDisplay();
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        updatePriceDisplay();
    }

    function updatePriceDisplay() {
        if (!container) return;

        const priceSpan = container.querySelector(
            ".pVsC7zJQIkSA6DQzIOUL.LehIaXU1BsyOafwsEwLX.font-bold div span:last-child"
        );
        if (!priceSpan) return;

        let usdText = priceSpan.innerText.trim();
        if (!usdText.startsWith("$")) return;

        usdText = usdText.replace("$", "").trim();
        const usdValue = parseFloat(usdText.replace(/,/g, ""));
        if (isNaN(usdValue)) return;

        const krwValue = (usdValue * currentExchangeRate).toLocaleString();

        let krwInfo = container.querySelector(".my-krw-info");
        if (!krwInfo) {
            krwInfo = document.createElement("span");
            krwInfo.classList.add("my-krw-info");
            krwInfo.style.marginLeft = "8px";
            krwInfo.style.fontSize = "12px";
            krwInfo.style.color = "#898989";
            krwInfo.style.display = "inline-block";

            priceSpan.insertAdjacentElement("afterend", krwInfo);
        }

        krwInfo.textContent = `≈ ${krwValue} KRW`;
    }

    initExchangeRate();
})();
