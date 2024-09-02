<template>
  <el-header>
    <el-row justify="space-between" align="middle" class="header-content">
      <el-tabs v-model="activePage" @tab-click="handleTabClick">
        <el-tab-pane label="Главная" name="home">
          <router-link to="/" class="tab-link">Главная</router-link>
        </el-tab-pane>
        <el-tab-pane label="Конвертация" name="convert">
          <router-link to="/convert" class="tab-link">Конвертация</router-link>
        </el-tab-pane>
      </el-tabs>

      <!-- Выбор основной валюты -->
      <el-select v-model="baseCurrency" @change="onCurrencyChange" placeholder="Выберите валюту">
        <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
      </el-select>
    </el-row>
  </el-header>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCurrency } from '@/services/api/useCurrency.ts';

const router = useRouter();
const route = useRoute();
const { baseCurrency, fetchCurrencyRates } = useCurrency();
const currencies = ['USD', 'EUR', 'RUB'];

// Определяем активную страницу для табов
const activePage = ref(route.name ? route.name.toString() : 'home');

// Обработчик переключения табов
const handleTabClick = (tab) => {
  router.push({ name: tab.paneName });
};

// Обработчик изменения основной валюты
const onCurrencyChange = () => {
  fetchCurrencyRates();
};

// Следим за изменением маршрута для обновления активного таба
watch(
    () => route.name,
    (newRoute) => {
      activePage.value = newRoute ? newRoute.toString() : 'home';
    }
);

fetchCurrencyRates();
</script>

<style scoped>
.header-content {
  padding: 0 20px;
  align-items: center;
}

.site-title {
  margin: 0;
}

.tab-link {
  display: none; /* Скрыть ссылки для корректного отображения вкладок */
}

.el-tabs {
  margin-right: auto;
}
</style>
