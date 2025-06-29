document.addEventListener("alpine:init", () => {
  Alpine.store("cart", {
    isOpen: false,
    cart: {},
    quantityUpdating: {},

    toggleCartVisibility() {
      console.log("Toggle cart visibility");

      this.isOpen = !this.isOpen;
    },

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

    async addToCart(variantId, quantity = 1) {
      console.log(`Adding item ${variantId} to cart with quantity ${quantity}`);

      try {
        await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: variantId, quantity }),
        });

        // Re-fetch cart to update the UI
        await this.init();

        this.isOpen = true; // Open cart after adding item
        setTimeout(() => {
          this.isOpen = false; // Close cart after 2 seconds
        }, 2000);
      } catch (error) {
        console.error(`Failed to add item ${variantId} to cart:`, error);
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

    async updateItemQuantity(lineItemId, newQuantity) {
      //Line Item Key Must be a string
      // Variant Id and be string or number
      try {
        this.quantityUpdating[lineItemId] = true;
        if (newQuantity < 1) {
          // Optional: remove item if quantity is 0
          console.log(`Removing item ${lineItemId} from cart`);
          await fetch("/cart/change.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: String(lineItemId), quantity: 0 }),
          });
        } else {
          await fetch("/cart/change.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: String(lineItemId),
              quantity: newQuantity,
            }),
          });
        }

        await this.init(); // re-fetch and update UI
      } catch (error) {
        console.error(`Failed to update item ${lineItemId}:`, error);
      } finally {
        this.quantityUpdating[lineItemId] = false;
      }
    },

    // create a function that removes a line item from the cart
    async removeItem(lineItemId) {
      console.log(`Removing item ${lineItemId} from cart`);

      try {
        await fetch("/cart/change.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: String(lineItemId), quantity: 0 }),
        });

        await this.init(); // re-fetch and update UI
      } catch (error) {
        console.error(`Failed to remove item ${lineItemId}:`, error);
      }
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount / 100);
    },
  });
});
