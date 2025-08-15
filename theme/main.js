document.addEventListener("DOMContentLoaded", function() {
    function loadComponent(file, targetId) {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(targetId).innerHTML = data;
                // Khởi tạo các icons sau khi đã tải component
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            })
            .catch(error => {
                console.error(`Error loading component from ${file}:`, error);
            });
    }

    loadComponent('header2.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});