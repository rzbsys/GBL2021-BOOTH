$('.change').hide();
$('.iframe').hide();
$('.gray').hide();
$('.confirm').hide();

var guid = -1;
var now_score = -1;

function change(cnt) {
    $('.btn').css('background-color', 'rgb(245, 245, 245)');
    $('.btn').css('color', 'black');
    if (cnt == 0) {
        $('#N1').css('background-color', '#00df86');
        $('#N1').css('color', 'white');
    } else if (cnt == 1) {
        $('#N2').css('background-color', '#FFD400');
        $('#N2').css('color', 'white');
    } else if (cnt == 2) {
        $('#N3').css('background-color', 'rgb(240, 68, 49)');
        $('#N3').css('color', 'white');
    }
}

function sel(cnt) {
    $('.change').show();
    anime({
        targets: '.change',
        translateY: [-1 * ($('.change').height() + 200), 0],
        duration: 1000,
        easing: 'easeInOutCirc',
    });
    change(cnt);
    setTimeout(() => {
        $.ajax({
            type: "POST", //요청 메소드 방식
            url:"/status",
            data: {
                'STAT':cnt
            },
            dataType:"json", //서버가 요청 URL을 통해서 응답하는 내용의 타입
            success : function(res){
                location.href = '/';
            },
            error : function(msg){
                location.href = '/?msg=오류가 발생하여 부스상태를 수정할 수 없습니다.';
            }
        });
    
    }, 800);

}


function score(cnt) {
    $('.btns').css('color', 'black');
    $('.btns').css('background-color', 'white');
    switch(cnt) {
        case 100:
            $('#S1').css('background-color', '#00df86');
            $('#S1').css('color', 'white');
            now_score = 100;
            break;
        case 90:
            $('#S2').css('background-color', '#FFD400');
            $('#S2').css('color', 'white');
            now_score = 90;
            break;
        case 80:
            $('#S3').css('background-color', 'rgb(240, 68, 49)');
            $('#S3').css('color', 'white');
            now_score = 80;
            break;
        case 0:
            $('#S4').css('background-color', 'rgb(60, 60, 60)');
            $('#S4').css('color', 'white');
            now_score = 0;
            break;
    }
}

function open_iframe(url) {
    $('#Iframe').attr('src', url);
    $('.iframe').show();
    $('.gray').fadeIn();

    anime({
        targets: '.iframe',
        translateY: [($('.iframe').height() + 200), 0],
        duration: 1000,
        easing: 'easeInOutCirc',
    });
}

function close() {
    setTimeout(() => {
        $('#Iframe').attr('src', 'none');
    }, 700);
    $('.gray').fadeOut();

    anime({
        targets: '.iframe',
        translateY: [0, ($('.iframe').height() + 200)],
        duration: 1000,
        easing: 'easeInOutCirc',
    });

    setTimeout(() => {
        $('.iframe').hide();
    }, 700);
}

$('.bth-box').on('click', () => {
    open_iframe('https://gbl2021.me/booth/' + bid + '?preview');
});

$('.close').on('click', () => {
    close();
});

$('.scan').on('click', () => {
    if (now_score == -1) {
        alert('점수를 선택해 주세요.');
        return;
    }
    open_iframe('/camera');
});


function add_score(uid) {
    guid = uid;
    close();
    $('.confirm').show();
    $.ajax({
        type: "POST",
        url:"/getname",
        data: {
            'UID':uid
        },
        dataType:"json",
        success : function(res){
            text = res['name'] + '에게\n'+ now_score + '점을 추가합니다.';
            $('.add_score_text').text(text);
        },
        error : function(msg){
            location.href = '/?msg=오류가 발생하여 부스상태를 수정할 수 없습니다.';
        }
    });


    anime({
        targets: '.confirm',
        translateY: [($('.confirm').height() + 200), 0],
        duration: 1000,
        easing: 'easeInOutCirc',
    });
}

$('#Cancel').on('click', () => {
    anime({
        targets: '.confirm',
        translateY: [0, ($('.confirm').height() + 200)],
        duration: 1000,
        easing: 'easeInOutCirc',
    });
    setTimeout(() => {
        $('.confirm').hide();
    }, 800);
});

$('#Accept').on('click', () => {
    $('.change').show();
    anime({
        targets: '.change',
        translateY: [-1 * ($('.change').height() + 200), 0],
        duration: 1000,
        easing: 'easeInOutCirc',
    });

    setTimeout(() => {
        $.ajax({
            type: "POST",
            url:"/addscore",
            data: {
                'SCORE':now_score,
                'UID':guid
            },
            dataType:"json",
            success : function(res){
                location.href = '/?msg=' + res['res'];
            }
        });
    }, 800);


});