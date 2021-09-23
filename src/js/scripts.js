class VideoToggle {

    constructor(videoBlock) {
        const video = videoBlock.querySelector('video');
        const btn = videoBlock.querySelector('.js-video-toggle')

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            video.toggleAttribute('controls');
            video.muted = !video.muted;
            video.play();

            const msgA = btn.getAttribute('data-message-a');
            const msgB = btn.getAttribute('data-message-b');
            const btnText = btn.innerHTML;

            if (btnText == msgA) {
                btn.innerHTML = msgB;
            } else {
                btn.innerHTML = msgA;
            }

        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const videoBlocks = document.querySelectorAll('.js-video-block');
    if (videoBlocks) {
        videoBlocks.forEach(videoBlock=>{
            new VideoToggle(videoBlock);
        });
    }

});