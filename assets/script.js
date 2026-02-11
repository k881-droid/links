let showAllButton = document.querySelector('#show-all')
let showImagesButton = document.querySelector('#show-images')
let showTextButton = document.querySelector('#show-text')
let showLinksButton = document.querySelector('#show-links')

let channelBlocks = document.querySelector('#channel-blocks')


showAllButton.addEventListener('click', () => { 
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    
    // NEW: Redraw lines after filter change
    setTimeout(drawLines, 100);
})

showImagesButton.addEventListener('click', () => {
    channelBlocks.classList.add('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    
    // NEW: Redraw lines after filter change
    setTimeout(drawLines, 100);
})

showTextButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.add('show-text')
    channelBlocks.classList.remove('show-links')
    
    // NEW: Redraw lines after filter change
    setTimeout(drawLines, 100);
})

showLinksButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.add('show-links')
    
    // NEW: Redraw lines after filter change
    setTimeout(drawLines, 100);
})

function drawLines() {
    const svg = document.getElementById('connection-lines');
    
    // 1. Clear previous lines
    svg.innerHTML = '';

    // 2. Set SVG height to match the whole page
    // We use Math.max to be safe across browsers
    const fullHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    );
    svg.style.height = fullHeight + 'px';

    // 3. Define the groups to connect
    const blockTypes = ['.image-block', '.text-block', '.link-block'];

    // 4. Loop through each type separately
    blockTypes.forEach(selector => {
        const blocks = document.querySelectorAll(selector);
        
        // --- NEW: Filter out hidden blocks ---
        // We convert the NodeList to an Array so we can use .filter()
        const visibleBlocks = Array.from(blocks).filter(block => {
            // Check if the block is hidden by CSS (opacity: 0)
            const style = window.getComputedStyle(block);
            return style.opacity !== '0' && style.display !== 'none';
        });

        // We need at least 2 blocks to make a line
        if (visibleBlocks.length < 2) return;

        // Connect the VISIBLE blocks one by one
        for (let i = 0; i < visibleBlocks.length - 1; i++) {
            const start = visibleBlocks[i];
            const end = visibleBlocks[i + 1];

            // Get coordinates
            const startRect = start.getBoundingClientRect();
            const endRect = end.getBoundingClientRect();

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            // Calculate Centers
            const x1 = startRect.left + (startRect.width / 2) + scrollX;
            const y1 = startRect.top + (startRect.height / 2) + scrollY;
            const x2 = endRect.left + (endRect.width / 2) + scrollX;
            const y2 = endRect.top + (endRect.height / 2) + scrollY;

            // Create the line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            
            // Add styling (Red color)
            line.setAttribute('stroke', 'var(--red-bright)');
            line.setAttribute('stroke-width', '2');
            
            svg.appendChild(line);
        }
    });
}
// Redraw lines if window is resized
window.addEventListener('resize', drawLines);

// Get the channel contents
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
  
  // 1. Loop through the data and build the HTML blocks
  json.data.forEach((blockData) => {
    renderBlock(blockData); 
  });

  // 2. NEW: Draw the lines after blocks are placed
  
  // Wait 1 second for layout to settle
  setTimeout(() => {
      drawLines();
  }, 1000); 

  // Also redraw whenever an image finishes loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
      img.addEventListener('load', drawLines);
  });
  
  // Redraw if window resizes
  window.addEventListener('resize', drawLines);
});

