$(document).ready(load_end);

function load_end() {
    anime({
        targets: '.login',
        translateY: [500, 0],
        duration: 1400,
        easing: 'easeInOutCirc',
    });


    anime({
        targets: '.cir',
        translateX: [-200, 0],
        duration: 0,
        background: ['#FFF', '#FFD400'],
        rotate: function () { return anime.random(-360, 360); },
        delay: 1000,
    });


    anime({
        targets: '.rec',
        translateX: [200, 0],
        duration: 0,
        background: ['#FFF', 'rgb(59, 89, 255)'],
        rotate: function () { return anime.random(-360, 360); },
        delay: 1000,


    });

    anime({
        targets: '.tng',
        translateY: [-300, 0],
        duration: 0,
        delay: 1000,
        rotate: function () { return anime.random(-360, 360); },
    });



    
}
$('#Login-btn').on('click', () => {
    location.href = '/glogin';
});