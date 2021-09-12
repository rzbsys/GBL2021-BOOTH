$('.warn').hide();

$(document).ready(() => {
    
    anime({
        targets:'.load',
        translateY: [0, -1 * $('.load').height() - 20],
        easing:'easeInOutCirc',
    });

    const URLSearch = new URLSearchParams(location.search);
    if (URLSearch.has('msg')) {
        $('.warn-text').text(URLSearch.get('msg'));
        console.log(URLSearch.get('msg'));
        $('.warn').show();
        anime({
            targets: '.warn',
            translateY: [-300, 0],
            duration: 800,
            delay: 600,
            easing: 'easeInOutCirc',
        });

        setTimeout(() => {
            anime({
                targets: '.warn',
                translateY: [0, -300],
                duration: 800,
                delay: 600,
                easing: 'easeInOutCirc',
            });
        }, 5000);
    }


});