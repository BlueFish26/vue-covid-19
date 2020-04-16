<template>
  <div class="home">
    <WorldData />
  </div>
</template>

<script>
// @ is an alias to /src
import WorldData from "@/components/WorldData.vue";

export default {
  name: "Home",
  components: {
    WorldData
  }
};
</script>
