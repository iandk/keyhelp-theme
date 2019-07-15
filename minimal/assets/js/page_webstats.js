// show all month 
$('#app-btn-show-all-month').on('click', function() {
    $('#app-all-month > .is-hidden').each(function() {
        $(this).removeClass('is-hidden');
    });
    $(this).remove();
});