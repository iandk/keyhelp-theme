// show or hide the textarea for custom remote access hosts
$('input[name="remote_access"]').on('change', function() {
    var $this = $(this);
    var $remoteAccessCustom = $('.app-show-with-remote-access-custom');

    if ($this.val() === 'custom' && $this.is(':checked'))
    {
        $remoteAccessCustom.show(200);
    }
    else
    {
        $remoteAccessCustom.hide(200);
    }
}).trigger('change');