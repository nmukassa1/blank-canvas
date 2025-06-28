document.addEventListener("alpine:init", () => {
  Alpine.store("menu", {
    isOpen: false,

    toggleMenuVisibility() {
      this.isOpen = !this.isOpen;
    },
  });
});
