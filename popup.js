const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const DEFAULT_TOGGLES = {
    usdt_m: true,
    usdc_m: true,
    spot_usdt: true,
};

const DEFAULT_EXCHANGE_RATE = 1300;

// Util: Promisify chrome.storage.sync.get
const getStorage = (keys) => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, resolve);
    });
};

// Util: Promisify chrome.storage.sync.set
const setStorage = (items) => {
    return new Promise((resolve) => {
        chrome.storage.sync.set(items, resolve);
    });
};

// Initialize UI Elements
const elements = {
    versionElem: document.getElementById("extensionVersion"),
    tabButtons: document.querySelectorAll(".tab-btn"),
    tabPages: document.querySelectorAll(".tab-page"),
    exchangeRateInput: document.getElementById("exchangeRate"),
    btnFetch: document.getElementById("btnFetch"),
    btnCancel: document.getElementById("btnCancel"),
    btnSave: document.getElementById("btnSave"),
    chkUsdtM: document.getElementById("chkUsdtM"),
    chkUsdcM: document.getElementById("chkUsdcM"),
    chkSpotUsdt: document.getElementById("chkSpotUsdt"),
};

document.addEventListener("DOMContentLoaded", async () => {
    // Set Extension Version
    try {
        const manifestData = chrome.runtime.getManifest();
        elements.versionElem.textContent = manifestData.version || "N/A";
    } catch (error) {
        console.error("Failed to get manifest version:", error);
        elements.versionElem.textContent = "N/A";
    }

    // Tab Navigation
    elements.tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            elements.tabButtons.forEach((b) => b.classList.remove("active"));
            elements.tabPages.forEach((page) => page.classList.remove("active"));
            btn.classList.add("active");
            const targetId = btn.dataset.target;
            document.getElementById(targetId).classList.add("active");
        });
    });

    // Initialize Exchange Rate
    const { u2k_exchangeRate } = await getStorage(["u2k_exchangeRate"]);
    elements.exchangeRateInput.value = typeof u2k_exchangeRate === "number" ? u2k_exchangeRate : DEFAULT_EXCHANGE_RATE;

    // Fetch Exchange Rate
    elements.btnFetch.addEventListener("click", async () => {
        try {
            const response = await fetch(EXCHANGE_RATE_API_URL);
            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }
            const data = await response.json();
            if (data?.rates?.KRW) {
                elements.exchangeRateInput.value = data.rates.KRW;
                alert("실시간 환율을 가져왔습니다.\n'저장' 버튼을 눌러야 최종 저장됩니다.");
            } else {
                throw new Error("API 응답에 KRW 환율이 없습니다.");
            }
        } catch (error) {
            console.error("환율 가져오기 실패:", error);
            alert("환율 가져오기 실패! (기본 환율: 1300)");
            elements.exchangeRateInput.value = DEFAULT_EXCHANGE_RATE;
        }
    });

    // Cancel Button
    elements.btnCancel.addEventListener("click", () => {
        window.close();
    });

    // Save Button
    elements.btnSave.addEventListener("click", async () => {
        const manualRate = parseFloat(elements.exchangeRateInput.value);
        if (manualRate > 0) {
            await setStorage({ u2k_exchangeRate: manualRate });
            alert("환율이 저장되었습니다.");
            window.close();
        } else {
            alert("올바른 환율을 입력해주세요.");
        }
    });

    // Initialize Toggles
    const { usdt_m, usdc_m, spot_usdt } = await getStorage(["usdt_m", "usdc_m", "spot_usdt"]);
    elements.chkUsdtM.checked = typeof usdt_m !== "undefined" ? usdt_m : DEFAULT_TOGGLES.usdt_m;
    elements.chkUsdcM.checked = typeof usdc_m !== "undefined" ? usdc_m : DEFAULT_TOGGLES.usdc_m;
    elements.chkSpotUsdt.checked = typeof spot_usdt !== "undefined" ? spot_usdt : DEFAULT_TOGGLES.spot_usdt;

    // Toggle Event Handlers
    const toggleSettings = [
        { element: elements.chkUsdtM, key: "usdt_m" },
        { element: elements.chkUsdcM, key: "usdc_m" },
        { element: elements.chkSpotUsdt, key: "spot_usdt" },
    ];

    toggleSettings.forEach(({ element, key }) => {
        element.addEventListener("change", async () => {
            await setStorage({ [key]: element.checked });
        });
    });
});
