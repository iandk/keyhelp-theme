// load default template
$('#app-btn-load-default-template').click(function() {

    var $this = $(this);

    var language = $('input[name="language"]').length ? $('input[name="language"]').val() : $('select[name=language]').val();
    var event = $('input[name="event"]').length ? $('input[name="event"]').val() : $('select[name=event]').val();

    var $subject = $('input[name="subject"]');
    var $text = $('textarea[name="text"]');
    var $senderName = $('input[name="sender_name"]');

    ajax({
        action: 'get_defaultmail',
        data: {
            language: language,
            event: event
        },
        success: function(data)
        {
            $subject.val(data.subject);
            $text.val(data.text);
            $text.trigger('input'); // trigger auto resize
            $senderName.val(data.sender_name);
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


// send test email
$('.app-send-test-email').click(function() {

    var $this = $(this);

    var $error= $('#app-send-test-error');
    var $errorMessage = $('#app-send-test-error-message');
    var $success = $('#app-send-test-success');

    ajax({
        action: 'send_email_template_test',
        data: {
            recipient	: $('input[name=test_recipient]').val(),
            subject		: $('input[name=subject]').val(),
            text		: $('textarea[name=text]').val(),
            sender_name : $('input[name=sender_name]').val()
        },
        success: function(data)
        {
            if (data.error)
            {
                $errorMessage.html(data.error_msg);
                $error.show();
            }
            else
            {
                $success.show();
            }
        },
        beforeSend: function()
        {
            $success.hide();
            $error.hide();
            $this.addClass('is-loading');
        },
        complete: function()
        {
            $this.removeClass('is-loading');
        }
    });
});

// add placeholder texts
var eventPlaceholderConfig = {
    user_created: ['user', 'password', 'panel_url'],
    user_loginchanged: ['user', 'password', 'panel_url'],
    forgot_password: ['user', 'reset_link', 'panel_url'],
    emailaccount_created: ['user', 'email'],
    diskspace_warning: ['user', 'server'],
    diskspace_exceeded: ['user', 'server'],
    domain_enabled: ['user', 'domain'],
    domain_disabled: ['user', 'domain'],
    backup_succeeded: ['server', 'backup_type', 'error_message'],
    backup_failed: ['server', 'backup_type', 'error_message']
};

$('select[name="event"], input[name="event"]').on('change', function() {
    var $this = $(this);
    var $help = $('#app-placeholder');
    var $placeholderWrapper = $('#app-placeholder-wrapper');

    var placeholders = eventPlaceholderConfig[ $this.val() ];

    if (placeholders !== undefined)
    {
        var helpText = placeholderTexts['placeholder_start'];

        for (var key in placeholders)
        {
            helpText += '<br>' + placeholderTexts['placeholder_' + placeholders[key]];
        }

        $help.html(helpText);
        $placeholderWrapper.show();
    }
    else
    {
        $placeholderWrapper.hide();
        $help.html('');
    }
}).trigger('change');