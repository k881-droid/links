let showAllButton = document.querySelector('#show-all')
let showImagesButton = document.querySelector('#show-images')
let showTextButton = document.querySelector('#show-text')
let showLinksButton = document.querySelector('#show-links')
let showAudioButton = document.querySelector('#show-audio')
let showVideoButton = document.querySelector('#show-videos')
let channelBlocks = document.querySelector('#channel-blocks')


showAllButton.addEventListener('click', () => { 
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')
    
// Below is the setTimeout function, which I learnt from Google Gemini. I have explained the reasoning in greater detail later on in the code. I have set it after every time a class is added because this is a function that is necessary for our 'connection lines' to be redrawn over and over again, so each time we change our classes, we must employ it again(Again, I will explain the reasoning in Michael's desired format later on in the code).

    setTimeout(drawLines, 200);
})

showImagesButton.addEventListener('click', () => {
    channelBlocks.classList.add('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')

 
    setTimeout(drawLines, 200);
})

showTextButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.add('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')
    
    
    setTimeout(drawLines, 200);
})

showLinksButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.add('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.remove('show-videos')
    

    setTimeout(drawLines, 200);
})

showAudioButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.add('show-audio')
    channelBlocks.classList.remove('show-videos')


    setTimeout(drawLines, 200);
})

showVideoButton.addEventListener('click', () => {
    channelBlocks.classList.remove('show-images')
    channelBlocks.classList.remove('show-text')
    channelBlocks.classList.remove('show-links')
    channelBlocks.classList.remove('show-audio')
    channelBlocks.classList.add('show-videos')
    
    
    setTimeout(drawLines, 200);
})

// For my categorization, I wanted to not only use buttons but I also wanted to use the concept of the 'string' through each categorization. E.g., if i click images, a red string goes through the images. If i click text, a red string goes through the text and so on. I could not hard code this red line going through each section as I was concerned that would not be responsive (e.g. if the Are.na channel owner adds or reduces images, or when we are moving from mobile to desktop).

// Thus, I inquired Google Gemini on how to create such an effect in a more responsive manner.

// I will now explain my understanding of this new code at each step of it.

// HTML SVG ELEMENT //

// First, I had to create an svg element in our HTML to draw the lines. From this I learnt something new - SVG is not simply a type of image, it is actually a text file masquerading as an image. It is a type of file that allows us to create shapes and lines that can be styled with CSS and manipulated with JavaScript. So, once that tag was created in my html file, the Js could then manipulate it to my liking (in this case, draw lines).

function drawLines() {
    const svg = document.getElementById('connection-lines');
    
// DRAW LINES FUNCTION //

// Next, we create a new JS function, titled 'drawLines.' We also use new JS syntax here - 'getElementById.' Because we had not explored this in class yet, I searched up what this JS property means:

// The getElementById() returns an Element whose has an id ONLY. That seems to be the difference between this and query selector. (https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById).

// So in this case, we are using it to select the svg element we created in our HTML, which has the id of 'connection-lines.

    svg.innerHTML = '';

// Now coming to the part in the beginning of the code that I said I would explain later. In order to redraw the lines every time we add a class, we need to first clear the svg of any exisiting lines. So, to translate this - SVG is our svg element, and innerHTML is the contents of our HTML. '' is an empty string. So, in translation, we are saying, make the contents of my HTML empty. In other words, make it blank - and once it is blank, fresh lines / svgs can be redrawn.

    svg.style.height = '0px'; 

    const fullHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    );
    svg.style.height = fullHeight + 'px';

// This is actually an error that Michael pointed out that I corrected now. Initially my height of the svg was set to the entire height of the page, but that was causing a lot of empty space at the bottom. This is because the svg was taking up the entire height of the page, even the part that was not visible. So, to correct this, I set the height to 0 first, and then I used JS to calculate the full height of the page and set it to that.

// To explain in more detail: the variable 'fullHeight' is taking a maximum value from the document's body scroll height and html scroll height (This is because browsers are inconsistent. Some browsers store the total page height in the <body> tag, while others store it in the <html> tag. By checking both and taking the maximum (largest) value, we guarantee we get the correct full height regardless of which browser the user is on.) 

// Previously, there was no svg.style.height = '0px'; line - by adding this, we are telling the svg to shrink first, forcing it to then recalculate the height of the page and then expand to that height.//

// SELECTING BLOCKS //

    const blockTypes = ['.image-block', '.text-block', '.link-block', '.audio-block', '.pdf-block', '.video-block'];

// Here we are simply selecting all the blocks of each type (e.g. image, text, link, audio, video).

    blockTypes.forEach(selector => {
        const blocks = document.querySelectorAll(selector);

        const visibleBlocks = Array.from(blocks).filter(block => {

// Here we are converting that list of blocks into a proper Javascript Array (because there are certain built-in helper functions that JavaScript gives to Arrays but not to the list you get from document.querySelectorAll.) and then use we are using the .filter() tool to create a new, smaller list (under the variable 'visbleBlocks').

            const style = window.getComputedStyle(block);

// 'getComputedStyle' is a JS tool that sees the elements after all CSS styles have been applied. So we are setting a variable called 'style' that will see the block after all CSS has been applied to it.

            return style.opacity !== '0' && style.display !== 'none';
        });
// And then here I think we are telling it how to filter the blocks - 'please give me the blocks that are not equal to opacity 0 and not equal to display none. In other words, please give me the blocks that are visible.

// DRAWIING LINES // 

        if (visibleBlocks.length < 2) return;

// So basically, we can't just 'select' which blocks we want to connect with the lines, we also have to tell the JS WHERE on the block we want these lines to connect. To begin with, the JS uses our visibleBlocks variable (our filtered blocks) from before, and says - if there are less than 2 blocks, we don't want them. This is because, to draw a line, you obviously need 2 blocks (it has to be drawn from point A to point B).

        for (let i = 0; i < visibleBlocks.length - 1; i++) {
            const start = visibleBlocks[i];
            const end = visibleBlocks[i + 1];

// This looks like complicated math, but it is actually not that complex once you understand the symbols. We are saying, let the starting block be 0 (in coding, lists start at 0, not 1. So 0 is the very first block.) 

//Then this part - 'i < visibleBlocks.length - 1' is saying 'stop before you get to the very last block.'

//For instance, if we had have 5 blocks, we can only draw 4 lines (1 to 2, 2 to 3, 3 to 4, 4 to 5).

//If we tried to draw a line starting from block #5, there is no block #6 to connect to. The code would crash. So we stop one early.

// I think the last part - 'i++' - is telling the JS to just increment by 1 (after you finish connecting block 0 to block 1, move i to 1. Then connect Block 1 to Block 2. And so on). 

// Lastly we are just setting variables for the 'start' and 'end' blocks (our point As and point Bs). 

// SETTING COORDINATES //

            const startRect = start.getBoundingClientRect();
            const endRect = end.getBoundingClientRect();

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

// On top of setting the variables for the start and end blocks, we also have to set the variables for the start and end coordinates (going back to the thing where I said we have to tell the JS not just WHICH blocks, but also WHERE on these blocks). 'getBoundingClientRect' is another new JS tool that I learnt from Gemini. This helps us retrieve information about the size of an element and its position relative to the viewport (https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect). 

// so we are setting variables for the starting coordinate and the end coordinate using getBoundingClientRect.

// And we are also setting 2 more variables to see the number of pixels by which the document is currently scrolled horizontally and vertically (because this will affect our line position as users scroll). This is done using another new JS tool, introduced to me by Gemini: the window.scrollX and window.scrollY tool (https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX).

            const x1 = startRect.left + (startRect.width / 2) + scrollX;
            const y1 = startRect.top + (startRect.height / 2) + scrollY;
            const x2 = endRect.left + (endRect.width / 2) + scrollX;
            const y2 = endRect.top + (endRect.height / 2) + scrollY;

// Finally, we set another layer of variables using our previous variables to form our final coordinates. 

// For our x coordinate, we are telling the JS: Start at the left edge of the box, then move halfway across the width to find the horizontal center (the = scrollX is to keep the coordinates responsive with the scroll). 

// For our y coordinate, we are telling it to start at the top edge, and then move halfway down to find the vertical center (again keeping in mind the vertical scroll).

            const line = document.createElementNS('http://www.w3.org/2000/svg','line');
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


