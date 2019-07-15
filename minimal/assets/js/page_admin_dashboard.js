//----------------------------------------------------------------------------------------------------------------------
// news
//----------------------------------------------------------------------------------------------------------------------

    var $newsContainer = $('#app-news-container');
    var newsTemplate = Handlebars.compile($('#app-news-template').html());

    ajax({
        action: 'get_news',
        data: {
            language: hash['language']
        },
        success: function(response) {
            if (response.error)
            {
                $newsContainer.html(response.error_msg.replace(/\n/, '<br>'));
            }
            else
            {
                $newsContainer.html('');
                var till = response.items.length > 3 ? 3 : response.items.length;
                for (var i = 0; i < till; i++)
                {
                    var placeholder = response.items[i];
                    placeholder.excerpt = $('<textarea/>').html(placeholder.excerpt).text();

                    placeholder.has_spacer = i < (till - 1);
                    $newsContainer.append(newsTemplate(placeholder));
                }
            }
        },
        error: function(textStatus, error)
        {
            $newsContainer.html('AJAX_ERROR');
            ajaxLogError(textStatus, error);
        },
        beforeSend: function()
        {
            $newsContainer.addClass('is-loading');
        },
        complete: function()
        {
            $newsContainer.removeClass('is-loading');
        }
    });

//----------------------------------------------------------------------------------------------------------------------
// notes
//----------------------------------------------------------------------------------------------------------------------

    var $notes = $('#app-notes');
    var $textarea = $('#app-notes-textarea');
    var $btnEdit =  $('#app-edit-notes');
    var $btnSave =  $('#app-save-notes');
    var $card = $notes.closest('.card');

    $btnEdit.click(function() {
        $btnEdit.hide();
        $btnSave.show(200);
        $notes.hide();
        $textarea.val($notes.text());
        $textarea.trigger('input'); // trigger auto-resize
        $textarea.show(200);
        $textarea.focus();
    });

    $textarea.on('blur', function() {
        var string = $textarea.val();
        var stringSanitized = string.replace(/(?:\r\n|\r|\n)/g, "\n").trim();

        $btnEdit.show(200);
        $btnSave.hide();
        $textarea.hide();
        $notes.text(stringSanitized);
        $notes.show(200);

        ajax({
            action: 'set_servernotes',
            data: {
                server_notes: stringSanitized
            },
            beforeSend: function()
            {
                $card.addClass('is-loading');
            },
            complete: function()
            {
                $card.removeClass('is-loading');
            }
        });
    });

//----------------------------------------------------------------------------------------------------------------------
// keyhelp update available
//----------------------------------------------------------------------------------------------------------------------

    var $keyhelpUpdateAvailable = $('#app-keyhelp-update-available');
    var $keyhelpUpdateInfoError = $('#app-keyhelp-update-info-error');

    ajax({
        action   : 'get_latestversion',
        success: function(response)
        {
            if (response.error)
            {
                $keyhelpUpdateInfoError.show();
            }
            else if (response.is_update_available)
            {
                $keyhelpUpdateAvailable.show();
            }
        },
        error: function(textStatus, error)
        {
            $keyhelpUpdateInfoError.show();
            ajaxLogError(textStatus, error);
        }
    });

//----------------------------------------------------------------------------------------------------------------------
// software updates available
//----------------------------------------------------------------------------------------------------------------------

    var $softwareUpdatesAvailable = $("#app-software-updates-available");
    var $softwareUpdatesContainer = $softwareUpdatesAvailable.parent();
    var $rebootRequired = $("#app-reboot-required");

    ajax({
        action: 'get_server_updates',
        success: function(response) {
            if (response.error)
            {
                console.log(response.error_msg);
            }
            else
            {
                $softwareUpdatesAvailable.prepend(response.update_message).show();

                if (response.is_reboot_required)
                {
                    $rebootRequired.show();
                }

                $softwareUpdatesContainer.show(200);
            }
        }
    });

