// handlebars helper
Handlebars.registerHelper('nl2br', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/\\n/gm, '<br>');
    return new Handlebars.SafeString(text);
});


// containers
var $logEmpty = $('#app-log-empty');
var $logContentContainer = $('#app-log-content-container');
var $logContent = $('#app-log-content');

// setting fields
var $showAccessLog = $('input[name="is_show_access_log"]');
var $showErrorLog = $('input[name="is_show_error_log"]');

// buttons
var $btnRefresh = $('.app-button-refresh');
var $btnClear = $('.app-button-clear');
var $btnStartRealTime = $('.app-button-start-real-time');
var $btnStopRealTime = $('.app-button-stop-real-time');

// button groups
var $grpRealTimeEnabled = $('.app-group-real-time-enabled');
var $grpRealTimeDisabled = $('.app-group-real-time-disabled');

// template
var logTemplate = Handlebars.compile($('#app-log-entry-template').html());

// file pointer position
var filePositions = {
    access_log: 0,
    error_log: 0
};

var isRealTimeEnabled = false;
var currentAjaxCall = null;


// on startup
getLogContent('refresh');


// button actions
$btnRefresh.on('click', function() {
    getLogContent('refresh');
});

$btnClear.on('click', function() {
    $logContent.html('');
});

$btnStartRealTime.on('click', function() {
    getLogContent('real_time');
    toggleRealTimeStatus();
});

$btnStopRealTime.on('click', function() {
    currentAjaxCall.abort();
    toggleRealTimeStatus();
});

$.each([$showAccessLog,$showErrorLog], function() {
    var $this = $(this);
    $this.on('change', function() {
        if (isRealTimeEnabled)
        {
            currentAjaxCall.abort();
        }
        else
        {
            $logContent.html('');
            getLogContent('refresh');
        }
    });
});


function toggleRealTimeStatus()
{
    isRealTimeEnabled = (1 - isRealTimeEnabled === 1);

    $grpRealTimeDisabled.toggle();
    $grpRealTimeEnabled.toggle();
}

function getLogContent(refreshType)
{
    currentAjaxCall = ajax({
        action: 'get_log_content',
        data: {
            refresh_type: refreshType,
            show_access_log: $showAccessLog.is(':checked') ? 1 : 0,
            show_error_log: $showErrorLog.is(':checked')? 1 : 0,
            file_positions: filePositions
        },
        success: function(response)
        {
            if (response.error)
            {
                console.log(response.error_msg);
            }
            else
            {
                if (refreshType === 'refresh')
                {
                    $logContent.html('');

                    if (response.rows.length === 0)
                    {
                        $logEmpty.show();
                        $logContentContainer.hide();
                    }
                    else
                    {
                        $logEmpty.hide();
                        $logContentContainer.show();

                        for (var i = 0; i < response.rows.length; i++)
                        {
                            $logContent.append(logTemplate(response.rows[i]));
                        }
                    }
                }
                else if (refreshType === 'real_time')
                {
                    for (var i=response.rows.length-1; i >= 0; i--)
                    {
                        $logContent.prepend(logTemplate(response.rows[i]));
                    }
                }

                tippy('#app-log-content', $.extend(tippySettingsTooltipMandatory, { target: '.app-tooltip-mandatory' }));

                filePositions.access_log = response.positions.access_log;
                filePositions.error_log = response.positions.error_log;
            }
        },
        error: function(textStatus, error)
        {
            if (textStatus.statusText === 'abort')
            {
                return;
            }
            ajaxLogError(textStatus, error);
        },
        beforeSend: function()
        {
            if (refreshType === 'refresh')
            {
                $btnRefresh.addClass('is-loading');
            }
        },
        complete: function()
        {
            // one may click the real time button, while refresh has not finished yet
            $btnRefresh.removeClass('is-loading');

            // never ending realtime monitoring
            if (isRealTimeEnabled)
            {
                getLogContent('real_time');
            }
        }
    });
}
