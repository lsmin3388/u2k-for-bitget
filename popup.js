const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const DEFAULT_TOGGLES = {
    usdt_m: true,
    usdc_m: true,
    spot_usdt: true,
};

const DEFAULT_EXCHANGE_RATE = 1300;

document.addEventListener("DOMContentLoaded", async () => {
    const versionElem = document.getElementById("extensionVersion");
    if (versionElem) {
        const manifestData = chrome.runtime.getManifest();
        versionElem.textContent = manifestData.version || "N/A";
    }

    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPages = document.querySelectorAll(".tab-page");

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabButtons.forEach((b) => b.classList.remove("active"));
            tabPages.forEach((page) => page.classList.remove("active"));
            btn.classList.add("active");
            const targetId = btn.dataset.target;
            document.getElementById(targetId).classList.add("active");
        });
    });

    const exchangeRateInput = document.getElementById("exchangeRate");
    const btnFetch = document.getElementById("btnFetch");
    const btnCancel = document.getElementById("btnCancel");
    const btnSave = document.getElementById("btnSave");

    chrome.storage.sync.get(["u2k_exchangeRate"], (result) => {
        exchangeRateInput.value =
            typeof result.u2k_exchangeRate === "number"
                ? result.u2k_exchangeRate
                : DEFAULT_EXCHANGE_RATE;
    });

    btnFetch.addEventListener("click", async () => {
        try {
            const response = await fetch(EXCHANGE_RATE_API_URL);
            if (!response.ok) {
                throw new Error("API 응답 오류");
            }
            const data = await response.json();
            if (data?.rates?.KRW) {
                exchangeRateInput.value = data.rates.KRW;
                alert("실시간 환율을 가져왔습니다.\n'저장' 버튼을 눌러야 최종 저장됩니다.");
            } else {
                alert("API 응답에 KRW 환율이 없습니다. (Fallback: 1300)");
                exchangeRateInput.value = DEFAULT_EXCHANGE_RATE;
            }
        } catch (error) {
            // console.error(error);
            alert("환율 가져오기 실패! (Fallback: 1300)");
            exchangeRateInput.value = DEFAULT_EXCHANGE_RATE;
        }
    });


    btnCancel.addEventListener("click", () => {
        window.close();
    });

    btnSave.addEventListener("click", () => {
        const manualRate = parseFloat(exchangeRateInput.value);
        if (manualRate > 0) {
            chrome.storage.sync.set({ u2k_exchangeRate: manualRate }, () => {
                alert("환율이 저장되었습니다.");
                window.close();
            });
        } else {
            alert("올바른 환율을 입력해주세요.");
        }
    });

    const chkUsdtM = document.getElementById("chkUsdtM");
    const chkUsdcM = document.getElementById("chkUsdcM");
    const chkSpotUsdt = document.getElementById("chkSpotUsdt");

    chrome.storage.sync.get(["usdt_m", "usdc_m", "spot_usdt"], (res) => {
        chkUsdtM.checked =
            typeof res.usdt_m !== "undefined" ? res.usdt_m : DEFAULT_TOGGLES.usdt_m;
        chkUsdcM.checked =
            typeof res.usdc_m !== "undefined" ? res.usdc_m : DEFAULT_TOGGLES.usdc_m;
        chkSpotUsdt.checked =
            typeof res.spot_usdt !== "undefined" ? res.spot_usdt : DEFAULT_TOGGLES.spot_usdt;
    });

    chkUsdtM.addEventListener("change", () => {
        chrome.storage.sync.set({ usdt_m: chkUsdtM.checked });
    });
    chkUsdcM.addEventListener("change", () => {
        chrome.storage.sync.set({ usdc_m: chkUsdcM.checked });
    });
    chkSpotUsdt.addEventListener("change", () => {
        chrome.storage.sync.set({ spot_usdt: chkSpotUsdt.checked });
    });
});
