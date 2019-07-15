$('select[name="logfile"]').on('change', function() {
    var $this = $(this);
    var $form = $this.closest('form');
    var value = $(this).val();

    if (value.substring(0, 1) !== '_')
    {
        $form.submit();
    }
});


$('.app-scroll-to-total-content-top').click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#app-total-content-top').offset().top - 80
    }, 1000);
});

$('.app-scroll-to-page-top').click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: 0
    }, 1000);
});

$('.app-scroll-to-total-content-bottom').click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#app-total-content')[0].offsetHeight + $('#app-total-content').offset().top
    }, 1000);
});