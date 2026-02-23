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
    
// Below is the setTimeout function, which I learnt from Google Gemini. I have explained the 'why' and 'how' in greater detail later on in the code. I have set it after every time a class is added because this is a function that is necessary for our 'connection lines' to be redrawn over and over again, so each time we change our classes, we must employ it again(Again, I will explain the reasoning in Michael's desired format later on in the code).

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

// INTERSECTION OBSERVER FOR DRAWING ANIMATION //

// Here I have applied what we learnt in class - an IntersectionObserver. 

// If a line enters the screen (isIntersecting), it adds a CSS class ('is-visible') which triggers the drawing animation in our stylesheet.

// If it leaves the screen, it removes the class, so it can draw again the next time we see it.
    let lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { 
        threshold: 0.1 // Triggers when just 10% of the line is visible on screen
    });

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
// And then here I think we are telling it how to filter the blocks - 'please give me the blocks that are not equal to opacity 0 and not equal to display none.' In other words, please give me the blocks that are visible.

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
            
// At first I did not understand the 'createElementNS' thing because couldn't we just create the element ourselves? But I think this is what actually makes the 'line' responsive - It allows the computer to draw the line at the exact moment the user loads the page. 

// Aside from that, I was not able to understand the link mentioned too in depth, but that is the 'Namespace' (the NS in createElementNS).

// Lastly, the 'line' is just a tag of SVG - just like HTML has a dictionary of tags: <div>, <p>, <img>, SVG has its own dictionary of tags: <circle>, <rect>, <line>.

            line.classList.add('connection-line'); 

// This is the same stuff we learnt in class - adding our class to style the line the way we want. 

            svg.appendChild(line);

// 'appendChild' is another new JS tool I learnt through this code. What it means is to make something the child of something else. In this case, I think it is making our line style and attaching it to the SVG container on the page.

// INTERSECTION OBSERVER: TELL THE OBSERVER TO WATCH THIS LINE //
// Now that the line is successfully created and appended to the page, we tell the observer we created at the top of this function to start watching it.

            lineObserver.observe(line);

        }
    });
}
        

window.addEventListener('resize', drawLines);

//This also ensures responsiveness - using addEventListener, we are saying - hey, watch for when the 'window' 'resizes.' And when it does, please execute the 'drawLines' function again. 

fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
  

  json.data.forEach((blockData) => {
    renderBlock(blockData); 
  });

// We learnt this in class - this is actually making the blocks visible, i.e. rendering each block. 

let modalDialog = document.querySelector('#channel-dialog');
let channelBlocksContainer = document.querySelector('#channel-blocks');

// This is the same as our class example, we are targetting specific ids using our JS variables. The only new thing here (as compared to the class example) is that we are creating a new variable here which targets ALL the blocks).

let dialogType = document.querySelector('#dialog-type');
let dialogImg = document.querySelector('#dialog-img');
let dialogEmbed = document.querySelector('#dialog-embed');
let dialogTitle = document.querySelector('#dialog-title');
let dialogArenaLink = document.querySelector('#dialog-arena-link');
let dialogDownloadLink = document.querySelector('#dialog-download-link');
let dialogCloseBtn = document.querySelector('#dialog-close-btn');

// I have made each element of the dialog a separate id, so it can be swapped out easily later.

channelBlocksContainer.addEventListener('click', (event) => {
    let clickedBlock = event.target.closest('li');
    if (!clickedBlock) return;

// I think, here, we are using event listener to listen for any clicks on the entire channel grid, and depending on wherever the click is, the closest list item will be triggered. That will cause the block which contains that list item to be triggered. So the modal with the metadata for that block will open.

    let allDOMBlocks = Array.from(channelBlocksContainer.children);
    let index = allDOMBlocks.indexOf(clickedBlock);
    let data = allBlocks[index]; 

// channelBlocksContainer.children grabs all the <li> blocks currently sitting inside my grid container. But, initially the browser returns them all as an HTML collection - we cannot incorporate JS onto this. That is why we use 'Array.' As explained in class, array will convert that data from an HTML list to a jS array.

// Because we generated the HTML blocks in the exact same order as the data we got from Are.na, we can use their position in the list (their index) to match them up.

// so I think, using the 'indexOf(clickedBlock)' tool, we are going to get that index number of the clicked block in return.

// lastly, the 'data' variable seems to be using 'allBlocks' - this  was the very first variable we created in our arena.js file, and it includes the original array of Are.na data that has all the image URLs, titles, and text.

// We are then plugging in the new index number we got from the previous line of code into this original array (e.g. allBlocks[2]).

// Because the HTML blocks were built in the same order as the arena data, the HTML block at Index 2 matches the arena data at Index 2. We have successfully grabbed the correct data for the clicked block.


// The next part of the code is just swapping out the content of our dialog with our arena metadata. 

    dialogType.textContent = data.type ? data.type : 'Untitled';
//Here we are swapping out the type (if there is no type the dialog will return 'Untitled').

// ADDITIONAL LOGIC FOR HANDLING MUSIC + AUDIO PLAYERS, AND TEXT 
    
// First hiding everything and clearing old players so they don't "stack" (what was happening initially is both the image and the player of the audio and video files were appearing in the modal).

    dialogImg.classList.add('hidden');
    dialogEmbed.classList.add('hidden');
    dialogEmbed.innerHTML = ''; 

    if (data.embed) {
        // YouTube/Soundcloud links
        dialogEmbed.innerHTML = data.embed.html;
        dialogEmbed.classList.remove('hidden');
    } 
    else if (data.attachment && data.attachment.content_type.includes('video')) {
        // uploaded MP4s
        dialogEmbed.innerHTML = `<video controls src="${data.attachment.url}"></video>`;
        dialogEmbed.classList.remove('hidden');
    } 
    else if (data.attachment && data.attachment.content_type.includes('audio')) {
        // uploaded MP3s
        dialogEmbed.innerHTML = `<audio controls src="${data.attachment.url}"></audio>`;
        dialogEmbed.classList.remove('hidden');
    } 
    else if (data.image) {
        // Only show the image if there isn't a video/audio player above
        dialogImg.src = data.image.large.src_2x;
        dialogImg.alt = data.title || 'Are.na block image';
        dialogImg.classList.remove('hidden');
    }

    // If it's a 'Text' type, show the actual inner content, not title
    if (data.type === 'Text') {
        dialogTitle.innerHTML = `<div>${data.content.plain}</div>`;
    } else if (data.title) {
        dialogTitle.innerHTML = `<div>${data.title}</div>`;
    } else {
        dialogTitle.innerHTML = `<p class="empty-state">No description</p>`;
    }
    // ADDITIONAL LOGIC FINISHED //


    dialogArenaLink.href = `https://www.are.na/block/${data.id}`;
//Swapping out the link.

    if (data.attachment) {
        dialogDownloadLink.href = data.attachment.url;
        dialogDownloadLink.classList.remove('hidden');
    } else {
        dialogDownloadLink.classList.add('hidden');
    }
// Showing the download link ONLY if there is an attachment.


    modalDialog.showModal();
// Open the modal!

});


dialogCloseBtn.addEventListener('click', () => {
    modalDialog.close();
});
// Close when clicking the close button.

modalDialog.addEventListener('click', (event) => {
    if (event.target === modalDialog) {
        modalDialog.close();
    }
});
// Close when clicking the backdrop.


// --- MODAL JS END --- //

  setTimeout(() => {
      drawLines();
  }, 1000); 

// Yes, now for the code above that I said I would explain here. So the setTimeout function is basically a way to set a timer on another action (https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout). In this case, we are setting a timer on our drawLines function, or, in other words, how fast the lines are being drawn. 

// Here, we have set it to 1000 milliseconds, because we are waiting for everything to load. Above, we are setting it to 200 milliseconds because its just some minor tweaking for when classes are changed. 

// In short - Timer 1: Draw it fast (For user experience), Timer 2: Fix it if it broke (For correctness)

  const images = document.querySelectorAll('img');
  images.forEach(img => {
      img.addEventListener('load', drawLines);
  });
});

// Lastly, here we are asking it to watch for a reload of the page, and when that event happens, the drawLines function will run again. 