// Accordion Toggle for Crop Rotation
document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector(".bi");
    
    // Toggle current
    if (content.style.display === "block") {
      content.style.display = "none";
      if (icon) {
        icon.classList.remove('bi-dash');
        icon.classList.add('bi-plus');
      }
    } else {
      // Close other accordions
      document.querySelectorAll(".accordion-content").forEach(c => c.style.display = "none");
      document.querySelectorAll(".accordion-header .bi").forEach(i => {
        i.classList.remove('bi-dash');
        i.classList.add('bi-plus');
      });
      
      content.style.display = "block";
      if (icon) {
        icon.classList.remove('bi-plus');
        icon.classList.add('bi-dash');
      }
    }
  });
});
