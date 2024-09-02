// src/composables/useCurrency.ts
import { ref } from 'vue';

const exchangeRates = ref<Record<string, number>>({});
const baseCurrency = ref('USD');

export function useCurrency() {
    const fetchCurrencyRates = async () => {
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency.value}`);
            if (!response.ok) {
                throw new Error('Failed to fetch currency rates');
            }
            const data = await response.json();
            exchangeRates.value = data.rates;
        } catch (error) {
            console.error('Error fetching currency rates:', error);
            exchangeRates.value = {};
        }
    };

    const getExchangeRate = (from: string, to: string): number => {
        if (!exchangeRates.value || Object.keys(exchangeRates.value).length === 0) {
            return 1; // Возвращаем 1, если данные не загружены
        }

        if (from === to) return 1;

        const rateFrom = exchangeRates.value[from];
        const rateTo = exchangeRates.value[to];

        if (!rateFrom || !rateTo) {
            console.warn(`Не удалось найти курс для валют: ${from} или ${to}`);
            return 1;
        }

        return rateTo / rateFrom;
    };

    return { exchangeRates, baseCurrency, fetchCurrencyRates, getExchangeRate };
}
