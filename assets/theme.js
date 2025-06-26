document.addEventListener("alpine:init", () => {
  Alpine.data("cart", () => ({
    cart: {},
    async init() {
      try {
        const response = await fetch("/cart.js");
        const data = await response.json();
        this.cart = data;
      } catch (error) {
        console.error("Failed to fetch cart", error);
        this.cart = { items: [], item_count: 0, total_price: 0 };
      }
    },

    async clearCart() {
      await fetch("/cart/clear.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Re-fetch cart to update Alpine state
      await this.init();
    },

    async addToCart(variantId, quantity = 1) {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: variantId, quantity }),
      });

      // Re-fetch cart to update the UI
      await this.init();
    },
  }));
});
