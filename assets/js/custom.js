document.addEventListener('DOMContentLoaded', function () {
    function toggleSidebar() {
        console.log("object")
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle("active");

        document.getElementById('body-overlay').classList.toggle("active");
    }

    document.getElementById('close-doc-btn').addEventListener('click', function () {
        const sidebar = document.querySelector('.doc_sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        document.getElementById('body-overlay').classList.remove('active');
    });

    document.getElementById('body-overlay').addEventListener('click', function () {
        const sidebar = document.querySelector('.doc_sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        this.classList.remove('active');
    });
    if (window.innerWidth <= 767) {
        document.getElementById('sidebar').addEventListener('click', function () {
            toggleSidebar();
        });
    }
    window.toggleSidebar = toggleSidebar;
 
});

function scrollWithOffset(id, offset = 80) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}
function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch(err => alert("Copy failed: " + err));
}
