<template>
  <el-main>
    <h1>Курсы валют по отношению к {{ baseCurrency }}</h1>
    <el-table v-if="exchangeData.length > 0" :data="exchangeData">
      <el-table-column prop="currency" label="Валюта" width="150" />
      <el-table-column prop="rate" label="Курс" width="200" />
    </el-table>
    <p v-else>Курсы валют не загружены. Пожалуйста, подождите...</p>
  </el-main>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useCurrency } from '@/services/api/useCurrency.ts';

const { exchangeRates, baseCurrency, fetchCurrencyRates } = useCurrency();
const currencies = ['USD', 'EUR', 'RUB'];

// Реактивные данные для отображения курсов валют
const exchangeData = computed(() => {
  if (!exchangeRates.value || Object.keys(exchangeRates.value).length === 0) {
    return [];
  }

  // Вычисляем курс каждой валюты по отношению к базовой валюте
  return currencies
      .filter((currency) => currency !== baseCurrency.value)
      .map((currency) => {
        const rate = exchangeRates.value[currency];
        const baseRate = exchangeRates.value[baseCurrency.value];

        // Рассчитываем правильный курс валюты относительно базовой валюты
        const calculatedRate = (baseRate / rate).toFixed(2);

        return {
          currency,
          rate: calculatedRate,
        };
      });
});

onMounted(() => {
  fetchCurrencyRates();
});

// Следим за изменением основной валюты и обновляем курсы
watch(baseCurrency, fetchCurrencyRates, { immediate: true });
</script>
