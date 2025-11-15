<template>
  <div class="mb-4">
    <label 
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :disabled="disabled"
      :class="selectClasses"
      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="help" class="mt-1 text-sm text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectClasses = computed(() => {
  const baseClasses = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  const disabledClasses = 'bg-gray-100 cursor-not-allowed';
  
  let classes = baseClasses;
  
  if (props.error) {
    classes = errorClasses;
  }
  
  if (props.disabled) {
    classes += ` ${disabledClasses}`;
  }
  
  return classes;
});
</script>
