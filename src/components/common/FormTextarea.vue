<template>
  <div class="mb-4">
    <label 
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="textareaClasses"
      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none"
    ></textarea>
    
    <div class="flex justify-between items-center mt-1">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="help" class="text-sm text-gray-500">{{ help }}</p>
      <p v-if="showCount" class="text-sm text-gray-400">
        {{ modelValue.length }}/{{ maxLength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  rows: 4,
  showCount: false
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const textareaClasses = computed(() => {
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
