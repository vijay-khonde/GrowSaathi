const headers = document.querySelectorAll(".accordion-header");
headers.forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector("i.bi");

    // Close all open items except current
    document.querySelectorAll(".accordion-content").forEach((c) => {
      if (c !== content) {
        c.style.display = "none";
      }
    });
    
    document.querySelectorAll(".accordion-header i.bi").forEach((i) => {
      if (i !== icon) {
        i.classList.remove('bi-dash');
        i.classList.add('bi-plus');
      }
    });

    // Toggle current
    if (content.style.display === "block") {
      content.style.display = "none";
      if (icon) {
        icon.classList.remove('bi-dash');
        icon.classList.add('bi-plus');
      }
    } else {
      content.style.display = "block";
      if (icon) {
        icon.classList.remove('bi-plus');
        icon.classList.add('bi-dash');
      }
    }
  });
});
