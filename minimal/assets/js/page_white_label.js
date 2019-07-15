// handle buttons to reset white label settings
$('.app-reset-all, .app-reset-language').on('click', function() {
    var $this = $(this);
    var $modal = $('#app-modal-reset-settings');
    var $resetType = $modal.closest('form').find('input[name="reset_type"]');

    var language = $this.hasClass('app-reset-all') ? 'all' : $this.data('reset-language');

    $resetType.val(language);
    $modal.addClass('is-active');
});