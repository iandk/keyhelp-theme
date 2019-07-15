//----------------------------------------------------------------------------------------------------------------------
// show / hide send login credentials checkbox
//----------------------------------------------------------------------------------------------------------------------

var $sendLoginCredentials = $('#app-send-login-credentials');
var $inputEmail = $('#input-email');
var $inputPassword = $('#input-password');

$inputEmail.on('input', function() {
    setSendLoginCredentialsVisibility();
});

$inputPassword.on('input, change', function() {
    setSendLoginCredentialsVisibility();
});

function setSendLoginCredentialsVisibility()
{
    if ($inputEmail.val().length > 0 && $inputPassword.val().length)
    {
        $sendLoginCredentials.show(200);
    }
    else
    {
        $sendLoginCredentials.hide(200);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// account template
//----------------------------------------------------------------------------------------------------------------------

var $accountTemplate = $('#input-account_template');
var $applyAccountTemplate = $('#app-apply-account-template');

$applyAccountTemplate.click(function() {
    var $this = $(this);

    ajax({
        action: 'get_account_template',
        data: {
            account_template_id: $accountTemplate.val()
        },
        success: function(response) {
            if (!response.error)
            {
                for (var key in response.template)
                {
                    var value = response.template[key];

                    var $element = $('[name="' + key + '"]');
                    var tag  = $element.prop('tagName').toLowerCase();
                    var type = $element.prop('type').toLowerCase();

                    if (type === 'radio')
                    {
                        $element.val([value]).trigger('change');
                    }
                    else if (type === 'checkbox')
                    {
                        $element.prop('checked', (value === '1' || value === true));
                    }
                    else if (tag === 'input')
                    {
                        // input could have types like 'email', 'number' and so on,
                        // so check this more generic input fields below radio / checkbox!

                        var $unlimited = $('[name="' + key + '_ul"]');

                        if ($unlimited.length > 0)
                        {
                            // fields with unlimited checkbox

                            $unlimited.prop('checked', value === '-1').trigger('change');
                            $element.val(value === '-1' ? '0' : value);
                        }
                        else
                        {
                            // normal input, nothing fancy

                            $element.val(value);
                        }
                    }
                    else if (tag === 'textarea')
                    {
                        $element.val(value);
                    }
                    else
                    {
                        console.log('unhandled key: ' + key);
                    }

                    // update multiplier field
                    if (key === 'disk_space' || key === 'traffic')
                    {
                        var $muliplier = $('[name="' + key + '_multiplier"]');

                        if (value === '0' || value === '')
                        {
                            $muliplier.val(1);
                        }
                        else if (value % 1048576 === 0)
                        {
                            $element.val(value / 1048576);
                            $muliplier.val(1048576);
                        }
                        else if (value % 1024 === 0)
                        {
                            $element.val(value / 1024);
                            $muliplier.val(1024);
                        }
                        else
                        {
                            $muliplier.val(1);
                        }
                    }
                }
            }
        },
        beforeSend: function()
        {
            $this.addClass('is-loading');
        },
        complete: function()
        {
            $this.removeClass('is-loading');
        }
    });
});

//----------------------------------------------------------------------------------------------------------------------
// show warning when disabling backup
//----------------------------------------------------------------------------------------------------------------------

if ($('form').prop('action').indexOf('action=edit') !== -1)
{
    var $backupCheckbox = $('input[name="backup"]');
    var backupDeletionWarningTemplate = Handlebars.compile($('#app-backup-deletion-warning-template').html());

    if ($backupCheckbox.prop('checked'))
    {
        $backupCheckbox.change(function() {
            if ($backupCheckbox.prop('checked'))
            {
                $('#app-backup-deletion-warning').remove();
            }
            else
            {
                $backupCheckbox.closest('.control').append(backupDeletionWarningTemplate());
            }
        });
    }
}

