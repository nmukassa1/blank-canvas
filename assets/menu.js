document.addEventListener("alpine:init", () => {
  Alpine.store("menu", {
    isOpen: false,

    toggleMenuVisibility() {
      this.isOpen = !this.isOpen;
      console.log("Menu is: ", this.isOpen);
      
    },

    activeParent: null,

    setActiveParent(index) {
      this.activeParent = this.activeParent === index ? null : index;
    },
  
    closeParent() {
      this.activeParent = null;
    },
  });
});
