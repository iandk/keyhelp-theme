var timer;
var $apacheServerStatus = $('#app-apache-server-status');

// trigger action on change of the dropdown
$('select[name="auto_refresh"]').on('change', function() {
    var millisecs = $(this).val() * 1000;

    clearInterval(timer);

    if (millisecs > 0)
    {
        // refresh one time at the beginning
        ajaxGetApacheServerStatus();

        timer = setInterval(ajaxGetApacheServerStatus, millisecs);
    }
});

// get statuspage with ajax
function ajaxGetApacheServerStatus()
{
    ajax({
        action: 'get_apacheserverstatus',
        dataType: 'html',
        data: {
            theme: hash['theme']
        },
        success: function(data)
        {
            $apacheServerStatus.html(data);
        }
    });
}