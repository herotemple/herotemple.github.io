<template>
  <div class="cyber-container">
    <!-- 动态背景层 -->
    <div class="grid-lines"></div>
    <div class="particles"></div>

    <!-- 头部 -->
    <CyberHeader title="CYBER DASHBOARD" />

    <!-- 卡片区域 -->
    <div class="card-grid">
      <GlowCard
        v-for="(card, index) in cards"
        :key="index"
        :title="card.title"
        :value="card.value"
        :glow-color="card.color"
      >
        <template #icon>
          <div class="card-icon">
            <CyberIcon :type="card.icon" />
          </div>
        </template>
      </GlowCard>
    </div>

    <!-- 全息图表 -->
    <HologramChart />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GlowCard from '@/components/GlowCard.vue';
import HologramChart from '@/components/HologramChart.vue';
import CyberHeader from '@/components/CyberHeader.vue';

const cards = ref([
  { title: 'DATA THROUGHPUT', value: '2.4Tbps', icon: 'data', color: '#00f7ff' },
  { title: 'NEURAL LOAD', value: '78%', icon: 'brain', color: '#7c4dff' },
  { title: 'QUANTUM NODES', value: '24', icon: 'node', color: '#00ff9d' },
  { title: 'SECURITY LEVEL', value: 'MAX', icon: 'shield', color: '#ff4d8a' }
]);
</script>

<style lang="scss">
.cyber-container {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.grid-lines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba($neon-blue, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba($neon-blue, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: -1;
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba($neon-blue, 0.05) 0%, transparent 70%);
  animation: particleFlow 20s linear infinite;
  z-index: -1;
}

@keyframes particleFlow {
  from { background-position: 0 0; }
  to { background-position: 1000px 1000px; }
}
</style>
