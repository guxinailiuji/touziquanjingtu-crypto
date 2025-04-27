document.addEventListener('DOMContentLoaded', function() {
    // Initialize graph
    const graphContainer = document.getElementById('graph');
    const forceGraph = new D3ForceGraph(graphContainer, sectors, companies);
    forceGraph.init();
    
    // Populate sectors list
    const sectorsListContainer = document.querySelector('.sectors-list');
    populateSectorsList(sectorsListContainer, sectors);
    
    // Handle search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        forceGraph.handleSearch(searchTerm);
    });
    
    // Handle link strength slider
    const linkStrengthSlider = document.getElementById('link-strength');
    linkStrengthSlider.addEventListener('input', function() {
        forceGraph.updateLinkStrength(parseFloat(this.value));
    });
    
    // Handle reset zoom button
    const resetZoomButton = document.getElementById('reset-zoom');
    resetZoomButton.addEventListener('click', function() {
        forceGraph.resetZoom();
    });
    
    // Set up sector filtering
    document.addEventListener('click', function(e) {
        if (e.target.closest('.sector-item')) {
            const sectorItem = e.target.closest('.sector-item');
            const sectorId = sectorItem.dataset.sectorId;
            
            // Toggle active class on sector items
            document.querySelectorAll('.sector-item').forEach(item => {
                if (item === sectorItem && !item.classList.contains('active')) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Filter graph by sector
            if (sectorItem.classList.contains('active')) {
                forceGraph.filterBySector(sectorId);
            } else {
                forceGraph.resetFilter();
            }
        }
    });
});

// Function to populate sectors list
function populateSectorsList(container, sectors) {
    sectors.forEach(sector => {
        const sectorItem = document.createElement('div');
        sectorItem.className = 'sector-item p-2 rounded flex items-center justify-between';
        sectorItem.style.backgroundColor = `${colorScheme[sector.id].bgColor}30`; // 30 for transparency
        sectorItem.style.border = `1px solid ${colorScheme[sector.id].bgColor}50`;
        sectorItem.dataset.sectorId = sector.id;
        
        const sectorLeftContent = document.createElement('div');
        sectorLeftContent.className = 'flex items-center';
        
        const sectorDot = document.createElement('span');
        sectorDot.className = 'w-3 h-3 rounded-full mr-2';
        sectorDot.style.backgroundColor = colorScheme[sector.id].bgColor;
        
        const sectorName = document.createElement('span');
        sectorName.textContent = sector.name;
        
        const sectorCount = document.createElement('span');
        sectorCount.className = 'text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-0.5';
        
        // Count companies in this sector
        const count = companies.filter(company => company.sectorId === sector.id).length;
        sectorCount.textContent = count;
        
        sectorLeftContent.appendChild(sectorDot);
        sectorLeftContent.appendChild(sectorName);
        sectorItem.appendChild(sectorLeftContent);
        sectorItem.appendChild(sectorCount);
        
        container.appendChild(sectorItem);
    });
}
