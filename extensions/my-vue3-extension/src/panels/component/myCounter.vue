<template>
  <div class="counter">
    <h2>is My vue ??????? ? {{ counter }}</h2>
    <ui-button class="blue"
               @click="addition">+</ui-button>
    <ui-button @click="subtraction">-</ui-button>
  </div>
</template>

<script>
export default {
  name: "myCounter",

  data() {
    return {
      counter: 0,
    };
  },

  methods: {
    addition() {
      this.counter += 1;
    },
    subtraction() {
      this.counter -= 1;
    },
  },
}
</script>
