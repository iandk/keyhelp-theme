//----------------------------------------------------------------------------------------------------------------------
// PHP Interpreter
//----------------------------------------------------------------------------------------------------------------------

// load available interpreter
$('#app-load-interpreters').on('click', function() {
    var $this = $(this);

    var $interpreterNotAvailable = $('#app-interpreter-not-available');
    var $interpreterError        = $('#app-interpreter-error');
    var $interpreterErrorMsg     = $('#app-interpreter-error-message');

    var $interpreterTable        = $('#app-interpreter-table');
    var $interpreterTbody        = $('#app-interpreter-tbody');
    var $interpreterCount        = $('#app-interpreter-count');

    var $ajaxFinished            = $('input[name="ajax_finished"]');
    var scheduledInstalls        = $('input[name="scheduled_installs"]').val();
    var interpreterTemplate      = Handlebars.compile($('#app-interpreter-template').html());

    $ajaxFinished.val(0);

    ajax({
        action: 'get_available_php_interpreters',
        success: function(response)
        {
            $interpreterNotAvailable.hide();
            $interpreterError.hide();
            $interpreterTable.hide();

            if (response.error)
            {
                $interpreterErrorMsg.html(response.error_msg);
                $interpreterError.show(200);
            }
            else
            {
                if (response.items.length === 0)
                {
                    $interpreterNotAvailable.show(200);
                }
                else
                {
                    $interpreterTbody.html('');

                    for (var i = 0; i < response.items.length; i++)
                    {
                        var item = response.items[i];
                        item.is_scheduled = scheduledInstalls.indexOf(item.main_version) > -1;
                        $interpreterTbody.append(interpreterTemplate(item));
                    }

                    $interpreterCount.html(response.items.length);
                    $interpreterTable.show(200);
                }
            }
        },
        error: function(textStatus, error)
        {
            $interpreterErrorMsg.html('AJAX_ERROR');
            $interpreterError.show();
            ajaxLogError(textStatus, error);
        },
        beforeSend: function()
        {
            $this.addClass('is-loading');
        },
        complete: function()
        {
            $ajaxFinished.val(1);
            $this.removeClass('is-loading');
        }
    });
}).trigger('click');


//----------------------------------------------------------------------------------------------------------------------
// RAM drive
//----------------------------------------------------------------------------------------------------------------------

var isTmpSelector    = 'input[type="checkbox"][name="is_tmp"]';
var isVarTmpSelector = 'input[type="checkbox"][name="is_var_tmp"]';

$(isTmpSelector + ', ' + isVarTmpSelector).on('change', function() {
    var $showWithEnabled = $('#app-show-with-enabled');
    var isEnabled = false;

    $(isTmpSelector + ', ' + isVarTmpSelector).each(function() {
        var $this = $(this);

        if ($this.prop('checked'))
        {
            isEnabled = true;
        }
    });

    if (isEnabled)
    {
        $showWithEnabled.show(200);
    }
    else
    {
        $showWithEnabled.hide(200);
    }
}).trigger('change');


//----------------------------------------------------------------------------------------------------------------------
// Login & sessions
//----------------------------------------------------------------------------------------------------------------------

var administrativeAccessBehavior = $('input[type="radio"][name="administrative_access_behavior"]');

$('textarea[name="administrative_access"]').on('input', function() {
   var $this = $(this);

   if ($this.val().trim() !== '')
   {
       administrativeAccessBehavior.prop('disabled', false);
   }
   else
   {
       administrativeAccessBehavior.prop('disabled', true);
   }
}).trigger('input');



//----------------------------------------------------------------------------------------------------------------------
// Webmail
//----------------------------------------------------------------------------------------------------------------------

// show / hide webmail settings depending on the selected webmail client
$('select[name="webmail_client"]').on('change', function() {
    var $this = $(this);
    var $showWithRoundcube = $('.app-show-with-roundcube');

    if ($this.val() === 'roundcube')
    {
        $showWithRoundcube.show(200);
    }
    else
    {
        $showWithRoundcube.hide(200);
    }
}).trigger('change');


//----------------------------------------------------------------------------------------------------------------------
// Backup
//----------------------------------------------------------------------------------------------------------------------

// show / hide settings when local repository is enabled
$('input[name="is_local_repo_enabled"]').on('change', function() {
    var $this = $(this);
    var $showWithLocalRepo = $('.app-show-with-local-repo');

    if ($this.prop('checked'))
    {
        $showWithLocalRepo.show(200);
    }
    else
    {
        $showWithLocalRepo.hide(200);
    }
}).trigger('change');