// disable / enable inout / select fields, when the 'unlimited' checkbox is selected
$('input[type="checkbox"][name$="_ul"]').on('change', function() {
    var $this = $(this);
    var checked = $this.prop('checked');

    $this.closest('.columns').find('input[type!="checkbox"], select').prop('disabled', checked);
}).trigger('change');

// show hide additional input fields if pm is set to 'dynamic'
$('input[name="pm"]').on('change', function () {
    var $this = $(this);
    var $showWithDynamic = $('.app-show-with-pm-dynamic');

    if ($this.prop('checked'))
    {
        if ($this.val() === 'dynamic')
        {
            $showWithDynamic.show(200);
        }
        else
        {
            $showWithDynamic.hide(200);
        }
    }
}).trigger('change');
