
//======================================================================================================================
// Sidebar
//======================================================================================================================

    // initialize perfect-scrollbar
    // but only on internal pages
    if ($('#sidebar').length > 0)
    {
        var ps = new PerfectScrollbar('#sidebar');

        // enable sidebar toggle
        $('#app-sidebar-toggle, #sidebar-overlay').on('click', function() {
            $('#sidebar').toggleClass('is-active');
            $('#app-sidebar-toggle-icon').toggleClass('is-hidden');
            $('#app-sidebar-toggle-icon-active').toggleClass('is-hidden');
            $('#sidebar-overlay').toggleClass('is-active');
        });
    }

//======================================================================================================================
// Item tables
//======================================================================================================================

    // checkbox to select / deselect all other checkboxes at once
    $('input[type="checkbox"].app-check-all').on('change', function() {
        var $this = $(this);
        var $table = $this.closest('table');
        var isChecked = $this.prop('checked');

        $table.find('input[type="checkbox"][name$="[]"]').prop("checked", isChecked);
    });

//======================================================================================================================
// Password fields
//======================================================================================================================

    // reveal password, when clicking the 'show' button
    $('.app-show-password').on('click', function() {
        var $this = $(this);
        var $password = $this.closest('.field').find('input');

        if ($password.prop('type') === 'password')
        {
            $this.text(hash['lang.hide']);
            $password.prop('type', 'text');
        }
        else
        {
            $this.text(hash['lang.show']);
            $password.prop('type', 'password');
        }
    });

    // generate password, when clicking the 'generate' button
    $('.app-generate-password').on('click', function() {

        var $form = $(this).closest('form');
        var $password = $form.find('input[name="password"]');
        var $passwordConfirmation = $form.find('input[name="password_confirmation"]');
        var $passwordSuggestion = $form.find('input[name="password_suggestion"]');

        var password = generatePassword();

        $password.val(password);
        $passwordConfirmation.val(password);
        $passwordSuggestion.val(password);

        $password.trigger('change');
    });

    // update password strength meter on password change
    $('input[name="password"]').on('change keyup', function() {
        var value = $(this).val();
        var $strengthMeter = $('#password-strength-meter');
        var strength = calculatePasswordStrength(value);

        $strengthMeter.val(strength);

        // update fallback
        var $progress = $strengthMeter.find('progress');
        if ($progress.length > 0)
        {
            $progress.val(strength);
            $progress.text(strength+'%');
        }

        // show / hide
        value === '' ? $strengthMeter.hide() : $strengthMeter.css('display', 'block'); // 'show' would add display: inline-block instead of block
    });

    // display password complexity help
    $('input[name="password"]').on('change keyup', function() {
        var value = $(this).val();
        var $parentContainer = $('#password-complexity-help');
        var complexity = new Object();

        // check
        complexity['min-length'] = value.length < hash['password.complexity.length']; // do not use keyword 'length' in complexity array
        complexity['letter']     = hash['password.complexity.letter']    && !value.match(/[a-zA-Z]+/);
        complexity['lowercase']  = hash['password.complexity.lowercase'] && !value.match(/[a-z]+/);
        complexity['uppercase']  = hash['password.complexity.uppercase'] && !value.match(/[A-Z]+/);
        complexity['digit']      = hash['password.complexity.digit']     && !value.match(/[0-9]+/);
        complexity['special']    = hash['password.complexity.special']   && !value.match(/[_\W]+/); // underscore not matched by \W

        // show / hide help texts
        for (var key in complexity)
        {
            var selector = '.app-password-complexity-' + key;
            complexity[key] ? $(selector).show() : $(selector).hide();
        }

        // show / hide parent container
        value === '' ? $parentContainer.hide() : $parentContainer.show();
    });

    // display password mismatch message
    $('input[name="password"], input[name="password_confirmation"]').on('change keyup', function() {
        var password = $('input[name="password"]').val();
        var confirmation = $('input[name="password_confirmation"]').val();
        var $confirmationHelp = $('#password-confirmation-missmatch');

        // show / hide
        confirmation !== '' && password !== confirmation ? $confirmationHelp.show() : $confirmationHelp.hide();
    });

//======================================================================================================================
// Forms
//======================================================================================================================

    // submit a form with a button, which is not part of the form itself
    // the button needs a data attribute linking to the id of the form
    // p.ex. <button data-submit-form="form-database-index">...</button>
   $('button[data-submit-form]').on('click', function() {
       var id = $(this).attr('data-submit-form');
       $('#'+id).trigger('submit');
   });


//======================================================================================================================
// Tabs
//======================================================================================================================

    // set a tab panel to active state on click on the corresponding links.
    $('.tabs a').on('click', function(event) {
        var $this = $(this);

        if ($this.data('is-link') !== true)
        {
            event.preventDefault();
            var target = $this.attr('href');
            setActiveTab(target);
        }
    });

    // when there are input field with required / special type attributes
    // and there may be errors with this fields -> jump to the tab on submit
    if ($('.tabs').length > 0)
    {
        // default type for button is 'submit', so we also looking for omitted type attribute
        var $submitButton = $('input[type="submit"], button[type="submit"], button[type=""], button:not([type])');

        $submitButton.on('click', function() {
            var $form = $submitButton.closest('form');
            var $invalidFields = $form.find(':invalid');

            if ($invalidFields.length > 0)
            {
                var tabId = $invalidFields.closest('.tabs-panel').attr('id');
                setActiveTab(tabId);
            }
        });
    }

    // open a specific tab on page load
    if ($('.tabs').length > 0)
    {
        var openTabOnStartup = getUrlQueryParameterValue(window.location.href, 'open_tab');

        if (openTabOnStartup)
        {
            setActiveTab('#'+openTabOnStartup);
        }
    }


//======================================================================================================================
// User menu
//======================================================================================================================

    // show user menu
    $('#app-user-menu-toggle').on('click, mouseenter', function() {
        $('#user-menu').removeClass('is-hidden');
    });

    // hide user menu
    $('#header, #app-user-menu-toggle, #user-menu').on('mouseleave', function() {
        if (!($('#header').is(':hover') || $('#app-user-menu-toggle').is(':hover') || $('#user-menu').is(':hover')))
        {
            $('#user-menu').addClass('is-hidden');
        }
    });


//======================================================================================================================
// Browse directory
//======================================================================================================================

    $('.app-browse-directory').on('click', function() {

        var $this = $(this);
        var $browser = $('#app-directory-browser');

        // update visibility
        if ($browser.is(':hidden'))
        {
            $browser.html('');
            $browser.removeClass('is-hidden');
            $this.text(hash['lang.hide']);

            ajaxGetDirectories($('input[name="path"]').val());
        }
        else
        {
            $browser.addClass('is-hidden');
            $this.text(hash['lang.browse'] + '...');
        }

        function ajaxGetDirectories(path)
        {
            ajax({
                action: 'get_directories',
                data: {
                    id_user: typeof directoryBrowserUserId === 'undefined' ? '' : directoryBrowserUserId,
                    username: typeof directoryBrowserUsername === 'undefined' ? '' : directoryBrowserUsername,
                    path: path,
                    purpose: directoryBrowserPurpose
                },
                success: function(data)
                {
                    if (data.error)
                    {
                        $browser.html('');
                        console.log(data.error_msg);
                    }
                    else
                    {
                        var $list = $('<ul></ul>');

                        for (var key in data.items)
                        {
                            var item = data.items[key];

                            $list.append(
                                '<li' + ( item['is_disabled'] ? ' class="has-text-grey"' : '' ) + '>' +
                                    ( item['is_disabled'] ? '' : '<a role="button" data-directory-path="' + item['path'] + '">' ) +
                                        '<span class="icon is-medium">' +
                                            '<i class="fas fa-folder"></i>' +
                                        '</span>'+
                                        item['name'] +
                                    ( item['is_disabled'] ? '' : '</a>' ) +
                                '</li>'
                            );
                        }

                        $browser.html($list);

                        $browser.find('a').on('click', function() {
                            var $this = $(this);
                            var path = $this.data('directory-path');
                            ajaxGetDirectories(path);
                            $this.closest('form').find('input[name="path"]').val(path);
                        });
                    }
                },
                beforeSend: function()
                {
                    $browser.addClass('is-loading');
                },
                complete: function()
                {
                    $browser.removeClass('is-loading');
                }
            });
        }
    });

//======================================================================================================================
// Modal
//======================================================================================================================

    // open modal
    $('[data-open-modal]').on('click', function() {
        var $this = $(this);
        var selector = '#' + $this.data('open-modal');
        $(selector).addClass('is-active');
    });

    // close modal
    $('.modal').each(function() {
        var $this = $(this);
        $this.find('.app-modal-close').on('click', function() {
            $this.removeClass('is-active');
        });
    });

//======================================================================================================================
// File upload
//======================================================================================================================

    $('.file-input[type="file"]').on('change', function() {
        var $this = $(this);
        var $fileName = $this.closest('.file').find('.file-name');
        var value = $this.val().replace(/C:\\fakepath\\/i, '');

        $fileName.text(value);
    });

//======================================================================================================================
// Auto-resize textareas
//======================================================================================================================

    $('textarea.app-auto-resize').each(function() {
        var $this = $(this);
        var originalRows = $this.prop('rows');

        $this.on('input', function() {
            var rows = $this.val().split('\n').length;

            if (rows < originalRows)
            {
                $this.prop('rows', originalRows);
            }
            else
            {
                $this.prop('rows', rows);
            }
        });

        $this.trigger('input');
    });

//======================================================================================================================
// Clock (visible on all pages)
//======================================================================================================================

    clock('#clock', 'HH:mm:ss');

//======================================================================================================================
// Copy to clipboard
//======================================================================================================================

    $('.app-copy-to-clipboard').on('click', function() {
        //IMPORTANT: When changing this code, one may need to replace the other occurances of this snippet also
        var $this = $(this);
        var $input = $this.closest('.field').find('input');
        copyToClipboard($input);
        copyToClipboardButtonAnimation($this);
    });

//======================================================================================================================
// Table sorting
//======================================================================================================================

    $('th[data-is-sortable]').click(function() {
        var page   = hash['app.page'];
        var table  = $(this).data('sorting-table');
        var column = $(this).data('sorting-column');

        ajax({
            action: 'table_sorting',
            data: {
                page: page,
                table: table,
                column: column
            },
            success: function(data)
            {
                if (data.error)
                {
                    console.log(data.error_msg);
                }
                else
                {
                    location.reload();
                }
            }
        });
    });

//======================================================================================================================
// Tooltips
//
// IMPORTANT: Do not implement 'hide tooltips on scroll' - on mobile and with larger tooltips,
//            one would not be able to scroll the tooltip into view.
//======================================================================================================================

    // The setDefaults() will not work with tippy's auto-initialization.
    // The auto-initialization will fire a way before the default settings are read.
    var tippySettingsDefault = {
        delay: [200, 200],
        placement: 'bottom',
        arrow: true,
        arrowType: 'sharp',
        theme: 'light-border',
        size: 'large',
        trigger: 'mouseenter focus click',
        // All tippy elements get a focus border, like they where links. We do not want this to happen,
        // so we disable the border. In case, someone navigates with keyboard, the border is drawn nethertheless
        // by the browser on links which is fine.
        a11y: false
    };

    // this is a replacement for the title="" attribute of html tags
    var tippySettingsTooltip = {
        trigger: 'mouseenter focus',
        // Disable tooltip for mobile devices, the text is just an enhancement and not required.
        // If enabled, it would leed to double tab on links on mobile devices, which is ugly.
        // First tab = opens tooltip, second tab = opens link
        touch: false
        // an other solution would be the following. One would be able to see the tooltip,
        // but the context menu of the browser will also opens :(
        //touchHold: true,
    };

    var tippySettingsTooltipMandatory = {
        interactive: true,
        touch: true,
        // Mandantory tooltips often contain more than some words.
        // Eg if called inside of the index tables, to postion of the tooltip may not work right,
        // if there are one 1-2 items in the table.
        boundary: 'window'
    };

    tippy.setDefaults(tippySettingsDefault);
    tippy('.app-tooltip', tippySettingsTooltip);
    tippy('.app-tooltip-mandatory', tippySettingsTooltipMandatory);