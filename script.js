// script.js
const dateInput = document.getElementById('date');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertButton = document.getElementById('convertButton');
const resultDiv = document.getElementById('result');
const convertedAmount = document.getElementById('convertedAmount');

const apiKey = '81469e5e4bfa29ca75b53c3e5d298fcd'; // **REPLACE WITH YOUR ACTUAL API KEY**

async function populateCurrencies() {
    try {
        const response = await fetch(`https://api.exchangeratesapi.io/latest?access_key=${apiKey}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("API Response (Currencies):", data);

        if (!data || !data.rates) {
            console.error("No currency data found. API Response:", data);
            alert("No currency data found. Please check your API key and network connection.");
            return;
        }

        const currencies = Object.keys(data.rates);

        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;

            const flagImg1 = document.createElement('img');
            flagImg1.src = `flags/${currency.toLowerCase()}.png`;
            flagImg1.alt = `${currency} Flag`;
            flagImg1.classList.add('flag-icon');
            option1.appendChild(flagImg1);

            const currencyText1 = document.createTextNode(` ${currency}`);
            option1.appendChild(currencyText1);

            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;

            const flagImg2 = document.createElement('img');
            flagImg2.src = `flags/${currency.toLowerCase()}.png`;
            flagImg2.alt = `${currency} Flag`;
            flagImg2.classList.add('flag-icon');
            option2.appendChild(flagImg2);

            const currencyText2 = document.createTextNode(` ${currency}`);
            option2.appendChild(currencyText2);

            toCurrencySelect.appendChild(option2);
        });

        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';

    } catch (error) {
        console.error("Error fetching currencies:", error);
        alert("Error fetching currencies. Check the console for details.");
    }
}

async function convertCurrency() {
    const date = dateInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    try {
        const response1 = await fetch(`https://api.exchangeratesapi.io/${date}?access_key=${apiKey}&symbols=${fromCurrency}`);
        if (!response1.ok) {
            const errorText = await response1.text();
            throw new Error(`API error: ${response1.status} - ${errorText}`);
        }
        const data1 = await response1.json();
        console.log("data1", data1);
        if (!data1 || !data1.rates || !data1.rates[fromCurrency]) {
            alert("Please select valid from currency");
            return;
        }
        const rateFrom = data1.rates[fromCurrency];

        const response2 = await fetch(`https://api.exchangeratesapi.io/${date}?access_key=${apiKey}&symbols=${toCurrency}`);
        if (!response2.ok) {
            const errorText = await response2.text();
            throw new Error(`API error: ${response2.status} - ${errorText}`);
        }
        const data2 = await response2.json();
        console.log("data2", data2);
        if (!data2 || !data2.rates || !data2.rates[toCurrency]) {
            alert("Please select valid to currency");
            return;
        }
        const rateTo = data2.rates[toCurrency];

        const rate = rateTo / rateFrom;

        const amount = 1;
        const converted = amount * rate;
        convertedAmount.textContent = `${amount} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`;
        resultDiv.classList.remove('hidden');
    } catch (error) {
        console.error("Error converting currency:", error);
        alert("Error converting currency. Check the console for details.");
    }
}


populateCurrencies();
convertButton.addEventListener('click', convertCurrency);

const today = new Date();
const todayFormatted = today.toISOString().slice(0, 10);
dateInput.value = todayFormatted;