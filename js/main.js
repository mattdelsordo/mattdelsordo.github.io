$(document).ready(function() {
    // add the image's alt text as a caption to the image
    $('.post-description p img , .post-content p img').after(function() {
        return `<div class='img-caption'>${this.alt}</div>`;
    });
    // adjust link hover for captions
    $('.img-caption').parent('a').addClass('img-caption-link');
});
