<template>
  <div
    class="glow-card"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style="{ '--glow-color': glowColor }"
  >
    <div class="card-content">
      <div class="corner-deco top-left"></div>
      <div class="corner-deco top-right"></div>
      <div class="corner-deco bottom-left"></div>
      <div class="corner-deco bottom-right"></div>

      <slot name="icon"></slot>
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: String,
  value: [String, Number],
  glowColor: {
    type: String,
    default: '#00f7ff'
  }
});

const hover = ref(false);
</script>

<style scoped lang="scss">
.glow-card {
  background: rgba($dark-bg, 0.8);
  border: 1px solid rgba($neon-blue, 0.3);
  border-radius: 8px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        45deg,
        transparent 40%,
        var(--glow-color) 50%,
        transparent 60%
    );
    opacity: 0;
    animation: scan 3s linear infinite;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: $glow-shadow;

    &::before {
      opacity: 0.3;
    }
  }
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-title {
  color: rgba(white, 0.8);
  font-family: $digital-font;
  font-size: 1.2rem;
  margin: 1rem 0;
}

.card-value {
  color: var(--glow-color);
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba($neon-blue, 0.5);
}

.corner-deco {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid $neon-blue;

  &.top-left {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  // 其他三个角类似样式...
}

@keyframes scan {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
</style>
