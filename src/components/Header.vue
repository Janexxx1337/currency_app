<template>
  <el-header>
    <el-row justify="space-between" align="middle" class="header-content">
      <!-- Навигация с использованием меню -->
      <el-menu :default-active="activePage" class="el-menu" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="home">
          <router-link to="/" class="menu-link">Главная</router-link>
        </el-menu-item>
        <el-menu-item index="convert">
          <router-link to="/convert" class="menu-link">Конвертация</router-link>
        </el-menu-item>
      </el-menu>

      <!-- Выбор основной валюты -->
      <div class="currency-select-container">
        <el-tooltip content="Выберите основную валюту" placement="bottom">
          <el-select
              v-model="baseCurrency"
              placeholder="Выберите валюту"
              size="large"
              class="currency-select"
              clearable
          >
            <el-option
                v-for="currency in currencies"
                :key="currency"
                :label="currency"
                :value="currency"
            >
              <span>
                {{ currency }} {{ getCurrencySymbol(currency) }}
              </span>
            </el-option>
          </el-select>
        </el-tooltip>
      </div>
    </el-row>
  </el-header>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCurrency } from '@/services/api/useCurrency.ts';

const router = useRouter();
const route = useRoute();
const { baseCurrency, fetchCurrencyRates } = useCurrency();
const currencies = ['USD', 'EUR', 'RUB'];

// Определяем активную страницу для меню
const activePage = computed(() => route.name ? route.name.toString() : 'home');

// Обработчик переключения пунктов меню
const handleMenuSelect = (index: string) => {
  router.push({ name: index });
};

// Функция для получения символа валюты
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD':
      return '$'; // Символ доллара
    case 'EUR':
      return '€'; // Символ евро
    case 'RUB':
      return '₽'; // Символ рубля
    default:
      return '';
  }
};

// Следим за изменением базовой валюты и обновляем курсы
watch(baseCurrency, () => {
  fetchCurrencyRates();
});
</script>

<style scoped>
.header-content {
  padding: 0 20px;
  align-items: center;
}

.el-menu {
  margin-right: auto;
  flex-grow: 1;
}

.menu-link {
  text-decoration: none;
  color: inherit;
}

.currency-select-container {
  display: flex;
  align-items: center;
}

.currency-select {
  width: 200px;
  margin-left: 20px;
}
</style>
