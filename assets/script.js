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
