# u2k for Bitget

![Extension Icon](icons/icon128.png)

## Overview

**u2k for Bitget** is a Chrome extension designed to enhance your trading experience on the Bitget cryptocurrency exchange. It provides real-time conversion of USDT (Tether) to KRW (South Korean Won), allowing you to monitor your investments and trades more effectively.

## Features

- **Real-Time Exchange Rates**: Automatically fetches the latest USD to KRW exchange rates from a reliable API.
- **Customizable Exchange Rate**: Manually set the exchange rate or use the fetched real-time rate.
- **Feature Toggles**:
  - **USDT-M Futures**: Enable or disable conversion on USDT-M Futures pages.
  - **USDC-M Futures**: Enable or disable conversion on USDC-M Futures pages.
  - **Spot Trading (Only USDT)**: Enable or disable conversion on Spot trading pages for USDT.
- **Dynamic Content Injection**: Injects scripts into Bitget's trading pages to display the converted KRW values.
- **User-Friendly Interface**: Simple and intuitive popup with easy navigation and configuration options.
- **Persistent Settings**: Saves your preferences using Chrome's storage API, ensuring your settings are maintained across sessions.

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/lsmin3388/u2k-for-bitget.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd u2k-for-bitget
    ```

3. **Load the Extension in Chrome**

    - Open Chrome and go to `chrome://extensions/`.
    - Enable **Developer mode** by toggling the switch in the top right corner.
    - Click on **Load unpacked** and select the cloned `u2k-for-bitget` directory.

4. **Verify Installation**

    - Ensure the extension icon appears in the Chrome toolbar.
    - Click on the icon to open the popup and configure your settings.

## Usage

1. **Open the Extension Popup**

    - Click on the **u2k for Bitget** icon in the Chrome toolbar to open the settings popup.

2. **Configure Exchange Rate**

    - **Set Exchange Rate Manually**: Enter the current USD to KRW exchange rate in the input field.
    - **Fetch Real-Time Rate**: Click the **"실시간 환율 가져오기"** button to fetch the latest rate automatically. Remember to click **"저장"** to apply the fetched rate.

3. **Toggle Features**

    - **USDT-M Future**: Enable or disable the conversion display on USDT-M Futures pages.
    - **USDC-M Future**: Enable or disable the conversion display on USDC-M Futures pages.
    - **Spot Trading (Only USDT)**: Enable or disable the conversion display on Spot trading pages for USDT.

4. **Save Settings**

    - After configuring your preferences, click the **"저장"** button to apply and save your settings.
    - To discard changes, click the **"취소"** button.

5. **View Converted Rates**

    - Navigate to the relevant Bitget trading pages. The extension will display the KRW equivalent alongside the USD prices.

## Screenshots

### Extension Popup

![Popup Screenshot](screenshots/popup.png)

### Exchange Rate Display on Bitget

![Exchange Rate Display](screenshots/exchange_rate_display.png)

## API Information

The extension utilizes the [ExchangeRate-API](https://www.exchangerate-api.com/) to fetch the latest USD to KRW exchange rates.

- **API Endpoint**: `https://api.exchangerate-api.com/v4/latest/USD`
- **Fallback Rate**: 1300 KRW/USD (used if the API fails to fetch the real-time rate)

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension does not guarantee the accuracy of the exchange rates provided. The developer is not responsible for any financial losses, trading errors, or other issues resulting from the use of this extension. All investment and trading decisions are the sole responsibility of the user.

## Contact

For any questions, issues, or suggestions, please open an issue on the [GitHub repository](https://github.com/lsmin3388/u2k-for-bitget) or contact the maintainer directly.

---