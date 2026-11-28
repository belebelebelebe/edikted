document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("table tbody");
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll("tr"));

    // ===== Get price from a row =====
    function getPrice(row) {
        const priceCell = row.cells[1]; // 2nd column = Price
        if (!priceCell) return 0;

        // Handles "$29.99", "29.99", "$29", etc.
        const text = priceCell.textContent.replace(/[^0-9.]/g, "");
        return parseFloat(text) || 0;
    }

    // ===== Sort =====
    function sortProducts(order) {
        const sorted = [...rows].sort((a, b) => {
            const priceA = getPrice(a);
            const priceB = getPrice(b);
            return order === "asc" ? priceA - priceB : priceB - priceA;
        });

        // Re-append rows in new order
        sorted.forEach(row => tableBody.appendChild(row));
    }

    // ===== Filter =====
    function filterProducts(min, max) {
        rows.forEach(row => {
            const price = getPrice(row);
            const show = price >= min && price <= max;
            row.style.display = show ? "" : "none";
        });
    }

    // ===== Event Listeners =====

    // Sort dropdown
    const sortSelect = document.getElementById("sort-price");
    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            if (this.value === "asc" || this.value === "desc") {
                sortProducts(this.value);
            }
        });
    }

    // Filter button
    const filterBtn = document.getElementById("filter-btn");
    if (filterBtn) {
        filterBtn.addEventListener("click", function () {
            const min = parseFloat(document.getElementById("min-price").value) || 0;
            const max = parseFloat(document.getElementById("max-price").value) || Infinity;
            filterProducts(min, max);
        });
    }

    // Reset filter
    const resetBtn = document.getElementById("reset-filter");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            document.getElementById("min-price").value = "";
            document.getElementById("max-price").value = "";
            rows.forEach(row => row.style.display = "");
        });
    }
});