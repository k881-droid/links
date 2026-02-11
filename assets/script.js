let showAllButton = document.querySelector('#show-all')
let showImagesButton = document.querySelector('#show-images')
let showTextButton = document.querySelector('#show-text')
let showLinksButton = document.querySelector('#show-links')

let channelBlocks = document.querySelector('#channel-blocks')


showAllButton.addEventListener('click', () => { 
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
})

showImagesButton.addEventListener('click', () => {
    channelBlocks.classList.add('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
})

showTextButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.add('show-text')
    channelBlocks.classList.remove('show-links')
})

showLinksButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.add('show-links')
})

function drawLines() {
    const svg = document.getElementById('connection-lines');
    
    // 1. Clear previous lines
    svg.innerHTML = '';

    // 2. Set SVG height to match the whole page
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

        // We need at least 2 blocks to make a line
        if (blocks.length < 2) return;

        // Connect them one by one
        for (let i = 0; i < blocks.length - 1; i++) {
            const start = blocks[i];
            const end = blocks[i + 1];

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


// For my categorization, I wanted to not only use buttons but I also wanted to use the concept of the string through each categorization. E.g., if i click images, a red string goes through the images and so on.

// I did not know how to do this, so I enquired with Google Gemini.Array

// From what I understand, I am explaining all the new codes in this one section. 

// we first use an svg element to draw the lines. We set it to be absolute and cover the whole page, but we also set pointer-events to none so that it doesn't interfere with clicking on the blocks.

// Then we have a function drawLines that does the following:
// 1. It clears any existing lines from the svg.
// 2. It calculates the full height of the page and sets the svg height accordingly.
// 3. It defines the block types (images, text, links) and loops through each type.
// 4. For each type, it finds all the blocks of that type and filters out any that are not visible (e.g., due to filtering).
// 5. If there are at least 2 visible blocks, it loops through them in pairs and calculates their center coordinates.
// 6. It creates an SVG line element connecting the centers of the two blocks, styles it with a red stroke, and appends it to the svg.

// Finally, we call drawLines after fetching and rendering the blocks, and also set it to be called whenever an image loads or the window resizes, to ensure the lines stay connected properly.    

// Also, the complicated part after getBoundingClientRect is basically used to measure the anchor Pts because i specifically wanted the centers of each block. so for instance, it will start at the left, and then move half width, and that is the center. The following list of lines are the coordinates for each lines. 

// there is also some syntax with a +1 to tell it to connect the first and second, then the second and third and so on.

// lastly the settiMEOUT is just to make sure the layout has settled before drawing the lines.