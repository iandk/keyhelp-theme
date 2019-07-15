$('select[name="timeframe"]').on('change', function() {
    var $this = $(this);
    var $form = $this.closest('form');
    $form.submit();
});