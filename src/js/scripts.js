$(document).ready(function () {

/* --------------------------------- functions --------------------------------- */

    // bubbles

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    var $setInterval;
    $('.bubbles_box').each(function () {
        var $this = $(this);
        // bubbles($this.find('.bubbles'));
        $this.hover(function () {
            clearInterval($setInterval);
            bubbles($this.find('.bubbles'));
        },function () {
            clearInterval($setInterval);
            $this.find('.bubbles').html('');
        });
    });


    function createBubble(el,cn) {
        var bubbleWrap = el;
        var el_size = randomInteger(10,80),
            el_left = randomInteger(1,100),
            el_top = randomInteger(1,100);
        var el_time = randomInteger(1000,3000);
        var elem = document.createElement('span');
        elem.style.width = el_size+'px';
        elem.style.height = el_size+'px';
        elem.style.top = el_top+'%';
        elem.style.left = el_left+'%';

        bubbleWrap.append(elem);

        setTimeout(function (){
            elem.className += cn;
        },50);
        setTimeout(function (){
            elem.remove();
        },el_time);


    }

    function bubbles(el) {

        // start bubbles

        createBubble(el,'moment');
        createBubble(el,'moment');
        createBubble(el,'moment');
        createBubble(el,'moment');
        createBubble(el,'moment');

        // periodic bubbles

        $setInterval = setInterval(function(){
            createBubble(el,'active');
        },180)
    }



/* --------------------------------- document load --------------------------------- */



/* --------------------------------- document resize --------------------------------- */

    $(window).resize(function () {
    });

/* --------------------------------- document scroll --------------------------------- */

    $(window).scroll(function () {
    });

});