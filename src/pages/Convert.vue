<template>
  <el-main>
    <h1>Конвертация валют</h1>
    <el-row :gutter="20" class="mt-3">
      <el-col :span="12">
        <el-select v-model="fromCurrency" @change="convertCurrency" placeholder="Выберите валюту">
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input v-model.number="fromAmount" @input="convertCurrency" placeholder="Введите сумму" />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-3">
      <el-col :span="12">
        <el-select v-model="toCurrency" @change="convertCurrency" placeholder="Выберите валюту">
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input v-model.number="toAmount" :disabled="true" placeholder="Результат" />
      </el-col>
    </el-row>
  </el-main>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useCurrency } from '@/services/api/useCurrency.ts';

const { getExchangeRate, fetchCurrencyRates } = useCurrency();
const fromCurrency = ref('USD');
const toCurrency = ref('RUB');
const fromAmount = ref(0);
const toAmount = ref(0);
const currencies = ['USD', 'EUR', 'RUB'];

// Функция конвертации
const convertCurrency = () => {
  if (!fromCurrency.value || !toCurrency.value || fromAmount.value === 0) {
    toAmount.value = 0;
    return;
  }

  const rate = getExchangeRate(fromCurrency.value, toCurrency.value);
  toAmount.value = parseFloat((fromAmount.value * rate).toFixed(2));
};

// Обновление при изменении входных данных
watch([fromCurrency, toCurrency, fromAmount], convertCurrency);

// Загружаем курсы валют при монтировании компонента
fetchCurrencyRates();
</script>

<style scoped>
.mt-3 {
  margin-top: 20px;
}
</style>
