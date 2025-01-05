let currentExchangeRate = 1300;
let observer = null;
let parentContainer = null;

function initExchangeRate() {
    chrome.storage.sync.get(["u2k_exchangeRate"], (result) => {
        if (result.u2k_exchangeRate) {
            currentExchangeRate = result.u2k_exchangeRate;
        }
        initObserver();
    });
}

function initObserver() {
    parentContainer = document.querySelector(".Fxik2p5xjHOekvHrD92i");
    if (!parentContainer) return;

    observer = new MutationObserver(() => {
        updatePriceDisplay();
    });

    observer.observe(parentContainer, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    updatePriceDisplay();
}

function updatePriceDisplay() {
    if (!parentContainer) return;

    const priceLi = parentContainer.querySelector("li");
    if (!priceLi) return;

    const textNodes = [...priceLi.childNodes].filter(
        (node) => node.nodeType === Node.TEXT_NODE
    );
    if (textNodes.length === 0) return;

    const usdText = textNodes[0].textContent.trim();
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
}

initExchangeRate();
