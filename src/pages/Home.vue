<template>
  <el-main>
    <el-card shadow="hover" class="currency-card">
      <h1 class="title">Курсы валют по отношению к {{ baseCurrency }}</h1>
      <el-table
          v-if="exchangeData.length > 0"
          :data="exchangeData"
          style="width: 100%;"
          border
          size="small"
          class="currency-table"
      >
        <el-table-column prop="currency" label="Валюта" />
        <el-table-column prop="rate" label="Курс" />
      </el-table>
      <el-empty v-else description="Курсы валют не загружены. Пожалуйста, подождите..."></el-empty>
    </el-card>
  </el-main>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useCurrency } from '@/services/api/useCurrency';

const { exchangeRates, baseCurrency, fetchCurrencyRates } = useCurrency();
const currencies = ['USD', 'EUR', 'RUB'];

// Объект символов валют для быстрого доступа
const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
};

// Реактивные данные для отображения курсов валют
const exchangeData = computed(() => {
  const rates = exchangeRates.value;
  const base = baseCurrency.value as 'USD' | 'EUR' | 'RUB';

  if (!rates || !rates[base]) {
    return [];
  }

  const baseRate = rates[base];
  return currencies
      .filter((currency) => currency !== base)
      .map((currency) => ({
        currency,
        rate: `${(baseRate / rates[currency]).toFixed(2)} ${currencySymbols[base] || ''}`,
      }));
});

onMounted(() => {
  fetchCurrencyRates();
});

// Следим за изменением основной валюты и обновляем курсы
watch(baseCurrency, fetchCurrencyRates, { immediate: true });
</script>

<style scoped>
@import '@/styles/modules/pages/home.css';
</style>
