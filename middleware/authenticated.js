export default function({ store, route, redirect }) {
    if (!store.getters["auth/isAuthenticated"]) {
        if (route.path.includes("/auth/signin") || route.path.includes("/mobile")) {} else {
            return redirect(`/auth/signin`);
        }
    }
}