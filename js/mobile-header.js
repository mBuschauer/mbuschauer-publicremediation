var $content = $('header .content'),
    $blur = $('header .overlay'),
    $nav = $('nav'), // Assuming 'nav' is your header
    headerOffset;

function calculateHeaderOffset() {
    headerOffset = $nav.offset().top * 0.25; // Set to 75% of the header's top offset
    console.log("Header offset recalculated: ", headerOffset);
}

$(window).on('resize', calculateHeaderOffset);

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Scroller() {
    this.latestKnownScrollY = 0;
    this.ticking = false;
}

Scroller.prototype = {
    init: function() {
        window.addEventListener('scroll', this.onScroll.bind(this), false);
        $blur.css('background-image', $('header:first-of-type').css('background-image'));
        calculateHeaderOffset(); // Initial calculation
    },

    onScroll: function() {
        this.latestKnownScrollY = window.scrollY;
        this.requestTick();
    },

    requestTick: function() {
        if (!this.ticking) {
            window.requestAnimFrame(this.update.bind(this));
        }
        this.ticking = true;
    },

    update: function() {
        var currentScrollY = this.latestKnownScrollY;
        this.ticking = false;

        console.log("Current Scroll Y: ", currentScrollY, " Header Offset: ", headerOffset);

        var slowScroll = currentScrollY / 2,
            blurScroll = currentScrollY * 2,
            opaScroll = 1.4 - currentScrollY / 400;

        $content.css({
            'transform': 'translateY(' + slowScroll + 'px)',
            '-moz-transform': 'translateY(' + slowScroll + 'px)',
            '-webkit-transform': 'translateY(' + slowScroll + 'px)',
            'opacity': opaScroll
        });

        $blur.css({
            'opacity': blurScroll / window.innerHeight
        });

        if (currentScrollY > headerOffset)
            $nav.css('position', 'fixed');
        else
            $nav.css('position', 'absolute');
    }
};

var scroller = new Scroller();
scroller.init();
