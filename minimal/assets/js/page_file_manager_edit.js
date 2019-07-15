// =====================================================================================================================
// Setup default editor
// =====================================================================================================================

    var textarea = document.getElementsByName('content')[0];
    var editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: 'text/plain'
    });
    editor.setSize(null, '50em');

// =====================================================================================================================
// Alert on unsaved changes
// =====================================================================================================================

    var $form = $('form');

    editor.on("change", function() {
        $form.addClass('app-unsaved-changes');
    });

    $form.submit(function() {
       $(window).unbind('beforeunload');
    });

    $(window).on('beforeunload', function () {
        if ($form.hasClass('app-unsaved-changes'))
        {
            // this messages is only displayed in old browsers (Chrome 51+ (Mid 2016), Safari 9.1+ (Mid 2016) etc )
            // No need to worry about i18n -> users should update their antique browsers.
            return "Unsaved changes detected, are you sure you want to continue?";
        }
    });

// =====================================================================================================================
// Available syntax highlightings
// =====================================================================================================================

    var syntaxHighlight = {
        html: {
            extensions: ['html', 'htm'],
            mode: 'text/html',
            mode_files: ['xml', 'htmlmixed', 'javascript', 'css']
        },
        php: {
            extensions: ['php'],
            mode: 'application/x-httpd-php',
            mode_files: ['xml', 'htmlmixed', 'javascript', 'css', 'clike', 'php']
        },
        css: {
            extensions: ['css'],
            mode: 'text/css',
            mode_files: ['css']
        },
        javascript: {
            extensions: ['js'],
            mode: 'text/javascript',
            mode_files: ['javascript']
        },
        json: {
            extensions: ['json'],
            mode: 'application/json',
            mode_files: ['javascript']
        },
        xml: {
            extensions: ['xml'],
            mode: 'application/xml',
            mode_files: ['xml']
        },
        lua: {
            extensions: ['lua'],
            mode: 'text/x-lua',
            mode_files: ['lua']
        },
        yaml: {
            extensions: ['yaml'],
            mode: 'text/x-yaml',
            mode_files: ['yaml']
        },
        twig: {
            extensions: ['twig'],
            mode: 'twig',
            mode_files: ['twig']
        },
        sql: {
            extensions: ['sql'],
            mode: 'text/x-mariadb',
            mode_files: ['sql']
        },
        sh: {
            extensions: ['sh'],
            mode: 'text/x-sh',
            mode_files: ['shell']
        },
        perl: {
            extensions: ['pl'],
            mode: 'text/x-perl',
            mode_files: ['perl']
        },
        python: {
            extensions: ['py'],
            mode: 'text/x-python',
            mode_files: ['python']
        },
        markdown: {
            extensions: ['md', 'markdown', 'markdn', 'mdown'],
            mode: 'text/x-markdown',
            mode_files: ['markdown']
        },
        scss: {
            extensions: ['scss'],
            mode: 'text/x-scss',
            mode_files: ['css']
        },
        less: {
            extensions: ['less'],
            mode: 'text/x-less',
            mode_files: ['css']
        }
    };

    for (var key in syntaxHighlight)
    {
        var item = syntaxHighlight[key];
        var extensionFound = item['extensions'].indexOf(fileExtension) !== -1;

        if (extensionFound)
        {
            var loaded = 0;
            var totalToLoad = item['mode_files'].length;

            for (var keyMode in item['mode_files'])
            {
                var src = '/theme/bulma/assets/vendor/codemirror/mode/' + item['mode_files'][keyMode] + '.js?' + cacheBusting;

                $.getScript(src, function () {
                    loaded++;
                    if (loaded === totalToLoad)
                    {
                        editor.setOption('mode', item['mode']);
                    }
                });
            }

            break;
        }
    }