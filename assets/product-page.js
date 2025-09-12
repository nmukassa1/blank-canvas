document.addEventListener('alpine:init', () => {
    Alpine.store('product', {
      selectedVariant: null,
      variants: [],
  
      init(variants) {
        this.variants = variants;
        // Preselect the first available variant
        this.selectedVariant = variants[0] || null;
      },
  
      selectVariant(variantId) {
        const variant = this.variants.find(v => v.id === variantId);
        if (variant) this.selectedVariant = variant;
      }
    });
  });