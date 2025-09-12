document.addEventListener("alpine:init", () => {
  Alpine.store("menu", {
    isOpen: false,

    toggleMenuVisibility() {
      this.isOpen = !this.isOpen;
      console.log("Menu is: ", this.isOpen);
      
    },
  });
});
