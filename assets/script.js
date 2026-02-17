let showAllButton = document.querySelector('#show-all')
let showImagesButton = document.querySelector('#show-images')
let showTextButton = document.querySelector('#show-text')
let showLinksButton = document.querySelector('#show-links')
let showAudioButton = document.querySelector('#show-audio')
let showVideoButton = document.querySelector('#show-videos')
let channelBlocks = document.querySelector('#channel-blocks')

// --- 1. UPDATED BUTTON LISTENERS (Now with Redraw trigger) ---

showAllButton.addEventListener('click', () => { 
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')
    
    // Wait for CSS fade, then redraw
    setTimeout(drawLines, 200);
})

showImagesButton.addEventListener('click', () => {
    channelBlocks.classList.add('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')

    // Wait for CSS fade, then redraw
    setTimeout(drawLines, 200);
})

showTextButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.add('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')
    
    // Wait for CSS fade, then redraw
    setTimeout(drawLines, 200);
})

showLinksButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.add('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')
    
    // Wait for CSS fade, then redraw
    setTimeout(drawLines, 200);
})

showAudioButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.add('show-audio')
    channelBlocks.classList.remove('show-videos')

     // Wait for CSS fade, then redraw
    setTimeout(drawLines, 200);
})

showVideoButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.add('show-videos')
    
    // Wait for CSS fade, then redraw
    setTimeout(drawLines, 200);
})


// --- 2. UPDATED DRAW LINES FUNCTION (Now checks visibility) ---

function drawLines() {
    const svg = document.getElementById('connection-lines');
    
    // 1. Clear previous lines
    svg.innerHTML = '';

    // 2. CRITICAL FIX: Reset height to 0 so the page can shrink!
    svg.style.height = '0px'; 

    // 3. Measure the new height
    const fullHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    );
    svg.style.height = fullHeight + 'px';

    // 4. Define who gets connected (Added Video and Audio here!)
    const blockTypes = ['.image-block', '.text-block', '.link-block', '.audio-block', '.pdf-block', '.video-block'];

    blockTypes.forEach(selector => {
        const blocks = document.querySelectorAll(selector);

        // 5. Filter out hidden blocks
        const visibleBlocks = Array.from(blocks).filter(block => {
            const style = window.getComputedStyle(block);
            // Check both Opacity AND Display (The "Leave the Room" check)
            return style.opacity !== '0' && style.display !== 'none';
        });

        // We need at least 2 visible blocks to make a line
        if (visibleBlocks.length < 2) return;

        // 6. Connect the dots
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

            line.classList.add('connection-line'); 

            svg.appendChild(line);
            
        }
    });
}

// Redraw lines if window is resized
window.addEventListener('resize', drawLines);

// Get the channel contents
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
  
  // Loop through the data and build the HTML blocks
  json.data.forEach((blockData) => {
    renderBlock(blockData); 
  });

  // Draw the lines after blocks are placed
  setTimeout(() => {
      drawLines();
  }, 1000); 

  // Also redraw whenever an image finishes loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
      img.addEventListener('load', drawLines);
  });
});

// For my categorization, I wanted to not only use buttons but I also wanted to use the concept of the string through each categorization. E.g., if i click images, a red string goes through the images and so on.

// I did not know how to do this, so I enquired with Google Gemini.

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

