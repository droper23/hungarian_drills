// admin.js

function setupAdminOverlay() {
    const overlay = document.getElementById('admin-overlay');
    if (!overlay) return;

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
            overlay.classList.toggle('open');
        }
    });
}
