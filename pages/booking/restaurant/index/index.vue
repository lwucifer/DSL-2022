<template></template>

<script>
export default {
  middleware({ store, redirect, query, app }) {
    return redirect(app.localePath({ path: '/booking/restaurant/review', query }));
  }
};
</script>
