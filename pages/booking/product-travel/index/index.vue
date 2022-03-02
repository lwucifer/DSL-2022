<template></template>

<script>
export default {
  middleware({ store, redirect, query, app }) {
    return redirect(app.localePath({ path: '/booking/product-travel/review', query }));
  }
};
</script>
