const defaultToggles = {
    usdt_m: true,
    usdc_m: true,
    spot_usdt: true
};

async function updateRegisteredScripts() {
    await chrome.scripting.unregisterContentScripts();

    const { usdt_m, usdc_m, spot_usdt } = await new Promise((resolve) => {
        chrome.storage.sync.get(defaultToggles, resolve);
    });

    if (usdt_m) {
        chrome.scripting.registerContentScripts([
            {
                id: "content-usdt-script",
                js: ["content-usdt.js"],
                matches: [
                    "*://bitget.com/futures/usdt/*",
                    "*://bitget.com/asia/futures/usdt/*",
                    "*://www.bitget.com/futures/usdt/*",
                    "*://www.bitget.com/asia/futures/usdt/*"
                ],
                runAt: "document_idle"
            }
        ]);
    }

    if (usdc_m) {
        chrome.scripting.registerContentScripts([
            {
                id: "content-usdc-script",
                js: ["content-usdc.js"],
                matches: [
                    "*://bitget.com/futures/usdc/*",
                    "*://bitget.com/asia/futures/usdc/*",
                    "*://www.bitget.com/futures/usdc/*",
                    "*://www.bitget.com/asia/futures/usdc/*"
                ],
                runAt: "document_idle"
            }
        ]);
    }

    if (spot_usdt) {
        chrome.scripting.registerContentScripts([
            {
                id: "content-spot-script",
                js: ["content-spot.js"],
                matches: [
                    "*://bitget.com/spot/*",
                    "*://bitget.com/asia/spot/*",
                    "*://www.bitget.com/spot/*",
                    "*://www.bitget.com/asia/spot/*"
                ],
                runAt: "document_idle"
            }
        ]);
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.get(defaultToggles, (current) => {
        const toSet = {};
        let needSet = false;

        for (const key of Object.keys(defaultToggles)) {
            if (typeof current[key] === "undefined") {
                toSet[key] = defaultToggles[key];
                needSet = true;
            }
        }

        if (needSet) {
            chrome.storage.sync.set(toSet, () => {
                updateRegisteredScripts();
            });
        } else {
            updateRegisteredScripts();
        }
    });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
        if ("usdt_m" in changes || "usdc_m" in changes || "spot_usdt" in changes) {
            updateRegisteredScripts();
        }
    }
});
