(async function () {
    "use strict";

    let currentExchangeRate = 1300;

    async function loadExchangeRate() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(["u2k_exchangeRate"], (result) => {
                if (result.u2k_exchangeRate) {
                    currentExchangeRate = result.u2k_exchangeRate;
                }
                resolve();
            });
        });
    }

    await loadExchangeRate();

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "sync" && changes.u2k_exchangeRate) {
            currentExchangeRate = changes.u2k_exchangeRate.newValue || 1300;
            // console.log("[position.js] 환율 업데이트:", currentExchangeRate);
        }
    });

    function replaceTextNodeValue(targetRef) {
        let node = targetRef.deref();
        if (!node) return;

        let text = node.nodeValue;
        if (!text) return;

        if (text.includes("KRW") || text.includes("₩") || text.includes("USDT")) return;

        const usdPattern = /([-+]?\d{1,3}(,\d{3})*(\.\d+)?)(\s*)USD(?!T)/gi;
        let match = usdPattern.exec(text);

        if (!match) {
            return;
        }

        const numeric = parseFloat(match[1].replace(/,/g, ""));
        if (isNaN(numeric)) return;

        const krwValue = numeric * currentExchangeRate;
        const krwText = `≈ ${krwValue.toLocaleString()} KRW`;

        const parentEl = node.parentElement;
        if (!parentEl) return;

        parentEl.style.display = "flex";
        parentEl.style.flexDirection = "column";
        parentEl.style.alignItems = "flex-start";

        let existingKrwSpan = parentEl.querySelector(".my-krw-info");
        if (existingKrwSpan) {
            existingKrwSpan.textContent = krwText;
        } else {
            const krwSpan = document.createElement("div");
            krwSpan.classList.add("my-krw-info");
            krwSpan.style.fontSize = "12px";
            krwSpan.style.color = "var(--content-tertiary, #898989)";
            krwSpan.style.marginTop = "2px";
            krwSpan.textContent = krwText;
            parentEl.appendChild(krwSpan);
        }
    }

    const observerConfig = {
        childList: true,
        characterData: true,
        subtree: true,
    };

    let mutationTargetRefs = [];
    let isScheduled = false;

    const callback = (mutations, observer) => {
        for (const mutation of mutations) {
            if (mutation.target.nodeName.toUpperCase() === "SVG") {
                continue;
            }
            mutationTargetRefs.push(new WeakRef(mutation.target));
        }

        if (isScheduled) return;
        isScheduled = true;

        requestAnimationFrame(() => {
            observer.disconnect();

            const visitedNodes = new WeakSet();

            for (let i = 0; i < mutationTargetRefs.length; i++) {
                let mutationTarget = mutationTargetRefs[i].deref();
                if (!mutationTarget) continue;
                if (visitedNodes.has(mutationTarget)) continue;

                visitedNodes.add(mutationTarget);

                switch (mutationTarget.nodeType) {
                    case Node.TEXT_NODE:
                        replaceTextNodeValue(new WeakRef(mutationTarget));
                        break;

                    case Node.ELEMENT_NODE:
                        if (
                            mutationTarget.innerHTML &&
                            /USD(?!T)/.test(mutationTarget.innerHTML)
                        ) {
                            const treeWalker = document.createTreeWalker(
                                mutationTarget,
                                NodeFilter.SHOW_TEXT
                            );

                            let node;
                            while (treeWalker.nextNode()) {
                                node = treeWalker.currentNode;
                                if (visitedNodes.has(node)) continue;
                                if (!node.isConnected) continue;

                                if (
                                    node.parentElement &&
                                    node.parentElement.closest(
                                        "textarea, [contenteditable='true']"
                                    )
                                ) {
                                    continue;
                                }

                                replaceTextNodeValue(new WeakRef(node));
                                visitedNodes.add(node);
                            }
                        }
                        break;

                    default:
                        break;
                }
            }

            mutationTargetRefs = [];
            isScheduled = false;

            observer.observe(document.body, observerConfig);
        });
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, observerConfig);

    // console.log("[position.js] Global MutationObserver for USD -> KRW started.");
})();
