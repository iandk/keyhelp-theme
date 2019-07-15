//----------------------------------------------------------------------------------------------------------------------
// index
//----------------------------------------------------------------------------------------------------------------------
$('#app-btn-show-more').on('click', function() {
    $('#app-all-recent-tasks > .is-hidden').each(function() {
        $(this).removeClass('is-hidden');
    });
    $(this).remove();
});

//----------------------------------------------------------------------------------------------------------------------
// create backup / create scheduled backup
//----------------------------------------------------------------------------------------------------------------------

// show / hide password input fields
$('input[name="is_enable_password"]').on('change', function() {
    var $passwordContainer = $('#app-password-container');
    var isChecked = $(this).prop('checked');

    if (isChecked)
    {
        $passwordContainer.show(200);

        if (typeof isEnablePassword === 'undefined' || ! isEnablePassword)
        {
            $passwordContainer.find('input[name="password"], input[name="password_confirmation"]').prop('required', true);
        }
        else
        {
            // Do nothing! This is the case on scheduled backups, which have password already set,
            // otherwise we would set the password fields to 'required', which is not what we want
            // if we just want to keep the password as is is, but change other values of the scheduled backup.
        }
    }
    else
    {
        $passwordContainer.hide(200);
        $passwordContainer.find('input[name="password"], input[name="password_confirmation"]').prop('required', false);
    }
}).trigger('change');

//----------------------------------------------------------------------------------------------------------------------
// create scheduled backup
//----------------------------------------------------------------------------------------------------------------------

// show input fields depending on interval settings
$('select[name="period"]').on('change', function() {
    var $this = $(this);
    var $weekdays = $('#app-weekdays');
    var $daysOfMonth = $('#app-days-of-month');

    switch ($this.val())
    {
        case 'weekly':
            $weekdays.show(200);
            $daysOfMonth.hide();
            break;
        case 'monthly':
            $weekdays.hide();
            $daysOfMonth.show(200);
            break;
        default:
            $weekdays.hide();
            $daysOfMonth.hide();
            break;
    }
}).trigger('change');

// show local repo limit message
$('input[name="repository"]').on('change', function() {
    var $this = $(this);
    var $localRepoLimit = $('#app-local-repo-limit');

    if ($localRepoLimit.length > 0)
    {
        if ($this.is(':checked'))
        {
            if ($this.val() === 'local')
            {
                $localRepoLimit.show();
            }
            else
            {
                $localRepoLimit.hide();
            }
        }
    }
}).trigger('change');

//----------------------------------------------------------------------------------------------------------------------
// remote settings
//----------------------------------------------------------------------------------------------------------------------

var $protocol = $('select[name="protocol"]');
var $sftpUseKeyPair = $('input[name="sftp_use_key_pair"]');
var $sftpPublicKey = $('input[name="sftp_public_key"]');
var $sftpPrivateKey = $('input[name="sftp_private_key"]');

var $inputKeyPair = $('#app-key-pair');
var $inputPassword = $('#app-password');

// switch between key pair set and not set
$sftpPublicKey.on('change', function() {
    var $this = $(this);
    var $showWithPublicKey = $('#app-show-with-public-key');
    var $showWithoutPublicKey = $('#app-show-without-public-key');

    if ($this.val() === '')
    {
        $showWithPublicKey.hide();
        $showWithoutPublicKey.show(200);
    }
    else
    {
        $showWithPublicKey.show(200);
        $showWithoutPublicKey.hide();
    }
});

// switch between password and key pair inputs
$sftpUseKeyPair.on('change', function() {
    var $this = $(this);

    if ($this.is(':checked'))
    {
        $inputKeyPair.show(200);
        $inputPassword.hide(0);

        // trigger sub-element change
        $sftpPublicKey.trigger('change');
    }
    else
    {
        $inputKeyPair.hide(0);
        $inputPassword.show(200);
    }
});

// show options depending on selected protocol
$protocol.on('change', function() {
    var $this = $(this);
    var $ftpOptions = $('#app-ftp-options');
    var $sftpOptions = $('#app-sftp-options');
    var $showWithoutKeyPair = $('#app-show-without-key-pair');

    if ($this.val() === 'ftp')
    {
        $ftpOptions.show(200);
        $sftpOptions.hide(0);
        $inputPassword.show(200);
        $inputKeyPair.hide();
    }
    else
    {
        $ftpOptions.hide(0);
        $sftpOptions.show(200);

        // trigger sub-element change
        $sftpUseKeyPair.trigger('change');
    }
}).trigger('change');


// create key pair
$('#app-create-key-pair').on('click', function() {
    var $this = $(this);

    ajax({
        action: 'generate_key_pair',
        success: function(data)
        {
            if (data.error === false)
            {
                $sftpPrivateKey.val(data.private_key);
                // wihtout trigger, on change won't fire on hidden elements
                $sftpPublicKey.val(data.public_key).trigger('change');
            }
            else
            {
                $sftpPrivateKey.val('');
                $sftpPublicKey.val('ERROR');
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

// remove key pair
$('#app-remove-key-pair').on('click', function() {
    // wihtout trigger, on change won't fire on hidden elements
    $('input[name=sftp_private_key]').val('');
    $('input[name=sftp_public_key]').val('').trigger('change');
});


// test connection
$('#app-test-connection').on('click', function() {
    var $this = $(this);
    var $connectionTestSuccess = $("#app-connection-test-success");
    var $connectionTestError = $("#app-connection-test-error");
    var $connectionTestErrorMessage = $("#app-connection-test-error-message");

    $connectionTestSuccess.hide();
    $connectionTestError.hide();

    ajax({
        action: 'check_remote_connection',
        data: {
            host                : $('input[name=host]').val(),
            port                : $('input[name=port]').val(),
            protocol            : $('select[name=protocol]').val(),
            ftp_use_ftps        : $('input[name=ftp_use_ftps]').is(':checked'),
            ftp_use_passive_mode: $('input[name=ftp_use_passive_mode]').is(':checked'),
            sftp_use_key_pair   : $('input[name=sftp_use_key_pair]').is(':checked'),
            directory           : $('input[name=directory]').val(),
            login               : $('input[name=login]').val(),
            password            : $('input[name=password]').val(),
            sftp_private_key    : $('input[name=sftp_private_key]').val()
        },
        success: function(data)
        {
            if (data.error === false)
            {
                $connectionTestSuccess.show(200);
			}
            else
            {
                $connectionTestError.show(200);
                $connectionTestErrorMessage.text(data.error_msg);
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
