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

// Реактивный заголовок страницы
const exchangeData = computed(() => {
  if (!exchangeRates.value || Object.keys(exchangeRates.value).length === 0) {
    return [];
  }

  return currencies
      .filter((currency) => currency !== baseCurrency.value)
      .map((currency) => ({
        currency,
        rate: (exchangeRates.value[currency] / exchangeRates.value[baseCurrency.value]).toFixed(2),
      }));
});

onMounted(() => {
  fetchCurrencyRates();
});

// Следим за изменением основной валюты и обновляем курсы
watch(baseCurrency, fetchCurrencyRates, { immediate: true });
</script>
