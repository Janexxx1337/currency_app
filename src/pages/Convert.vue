<template>
  <el-main>
    <el-card shadow="hover" class="converter-card">
      <h1 class="converter-title">Конвертация валют</h1>
      <el-row :gutter="20" class="mt-3">
        <el-col :span="12">
          <el-select
              v-model="fromCurrency"
              @change="convertCurrency"
              placeholder="Выберите валюту"
              size="large"
              class="currency-select"
          >
            <el-option
                v-for="currency in filteredFromCurrencies"
                :key="currency"
                :label="currency"
                :value="currency"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input
              v-model.number="fromAmount"
              @input="handleInput"
              placeholder="Введите сумму"
              size="large"
              class="currency-input"
              prefix-icon="el-icon-money"
              type="number"
              min="0"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-3">
        <el-col :span="12">
          <el-select
              v-model="toCurrency"
              @change="convertCurrency"
              placeholder="Выберите валюту"
              size="large"
              class="currency-select"
          >
            <el-option
                v-for="currency in filteredToCurrencies"
                :key="currency"
                :label="currency"
                :value="currency"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input
              v-model.number="toAmount"
              :disabled="true"
              placeholder="Результат"
              size="large"
              class="currency-input"
              prefix-icon="el-icon-check"
          />
        </el-col>
      </el-row>
    </el-card>
  </el-main>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useCurrency } from '@/services/api/useCurrency';

const { getExchangeRate, fetchCurrencyRates } = useCurrency();
const fromCurrency = ref('USD');
const toCurrency = ref('RUB');
const fromAmount = ref(0);
const toAmount = ref(0);
const currencies = ['USD', 'EUR', 'RUB'];

// Фильтруем список валют для первого селектора, исключая выбранную валюту во втором селекторе
const filteredFromCurrencies = computed(() => {
  return currencies.filter(currency => currency !== toCurrency.value);
});

// Фильтруем список валют для второго селектора, исключая выбранную валюту в первом селекторе
const filteredToCurrencies = computed(() => {
  return currencies.filter(currency => currency !== fromCurrency.value);
});

// Обработчик ввода
const handleInput = (value: string) => {
  const parsedValue = parseFloat(value);
  fromAmount.value = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
  convertCurrency();
};

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
watch([fromCurrency, toCurrency], convertCurrency);

// Загружаем курсы валют при монтировании компонента
fetchCurrencyRates();
</script>

<style scoped>
@import '@/styles/modules/pages/converter.css';
</style>
