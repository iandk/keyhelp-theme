// read the settings from the task row, and assign them to the modal
$('.app-edit-task').on('click', function() {
    var $this = $(this);
    var $modal = $('#app-modal-edit-task');
    var $form = $modal.closest('form');
    var $tr = $this.closest('tr');

    // update inputs
    var selectors = [
        'id', 'name', 'is_enabled', 'interval', 'interval_unit', 'timeframe_start', 'timeframe_end'
    ];

    for (var i = 0; i < selectors.length; i++)
    {
        var selector = 'input[name="' + selectors[i] + '"], select[name="' + selectors[i] + '"]';
        var value = $tr.find(selector).val();

        if (selectors[i] === 'name')
        {
            $modal.find('#app-task-name').html(value);
        }
        else if (selectors[i] === 'is_enabled')
        {
            $form.find(selector).prop('checked', value);
        }
        else
        {
            $form.find(selector).val(value);
        }
    }

    $modal.addClass('is-active');
});
