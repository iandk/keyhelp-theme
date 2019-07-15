//----------------------------------------------------------------------------------------------------------------------
// footer / css / javascript
//----------------------------------------------------------------------------------------------------------------------

// setup codemirror
var editorFooter = CodeMirror.fromTextArea(
    $('#input-footer')[0],
    {
        lineNumbers: true,
        mode: "text/html"
    }
);

var editorCss = CodeMirror.fromTextArea(
    $('#input-css')[0], {
        lineNumbers: true,
        mode: "text/css"
    }
);

var editorJs = CodeMirror.fromTextArea(
    $('#input-js')[0], {
        lineNumbers: true,
        mode: "text/javascript"
    }
);

// preview
$('#app-btn-preview-footer').click(function() {
    $('#footer > div').html(editorFooter.getValue());
});

$('#app-btn-preview-js').click(function() {
    $('#app-preview-js').remove();
    $('body').append('<script id="app-preview-js">' + editorJs.getValue() + '</script>');
});

$('#app-btn-preview-css').click(function() {
    $('#app-preview-css').remove();
    $('body').append('<style id="app-preview-css">' + editorCss.getValue()  +'</style>');
});

//----------------------------------------------------------------------------------------------------------------------
// images
//----------------------------------------------------------------------------------------------------------------------

$('.app-image-container').each(function() {
    var $this           = $(this);
    var $uploadForm     = $this.find('input[type="file"]');
    var $imageAndButton = $this.find('.app-image-and-button');
    var $image          = $this.find('.app-image');
    var $removeImage    = $this.find('.app-remove-image');
    var $hasImage       = $this.find('.app-has-image');

    $uploadForm.change(function() {
        loadPreviewImage(this, $image);
        $imageAndButton.show();
        $hasImage.val(1);
    });

    $removeImage.on('click', function() {
        $imageAndButton.hide();
        $image.attr('src', '');
        $hasImage.val(0);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// help
//----------------------------------------------------------------------------------------------------------------------

var buttonTemplate = Handlebars.compile($('#app-button-template').html());
var $areaContainer = $('.app-help-links-area-container');
var $helpLinksInput= $('input[name=help_links]');
var helpLinks;

try
{
    helpLinks = JSON.parse($helpLinksInput.val());
}
catch (e)
{
    helpLinks = '';
}

$areaContainer.each(function() {
    var $this          = $(this);
    var area = $this.data('area');
    var $radioButtons  = $this.find('input[type="radio"]');
    var $withCustom    = $this.find('.app-with-custom');
    var $addLink       = $this.find('.app-add-link');
    var $linkContainer = $this.find('.app-link-container');

    $radioButtons.on('change', function() {
        var $this = $(this);
        if ($this.val() === 'custom' && $this.prop('checked')) {
            $withCustom.show();

            // add new link, so it is not so empty, when clicking this
            if ($linkContainer.children().length == 0)
            {
                $addLink.trigger('click');
            }
        }
        else
        {
            $withCustom.hide();
        }
    });

    $addLink.on('click', function() {
        addButton('', 'https://', $linkContainer);
    });

    $linkContainer.on('click', '.app-remove-button', function() {
        $(this).closest('.columns').remove();
    });

    // on start
    if (helpLinks.hasOwnProperty(area))
    {
        var data = helpLinks[area];

        if (data.length === 0)
        {
            $radioButtons.val(['hide']);
        }
        else
        {
            for (var i = 0; i < data.length; i++)
            {
                addButton(data[i].label, data[i].url, $linkContainer);
            }
            $radioButtons.val(['custom']).trigger('change');
        }
    }
    else
    {
        $radioButtons.val(['default']);
    }
});


// on submit
$('form').submit(function() {
    var save = {};

    $areaContainer.each(function() {
        var $this = $(this)
        var area = $this.data('area');
        var behavior = $this.find('input[type="radio"]:checked').val();
        var $links = $this.find('.app-link-container > .columns');

        if (behavior === 'hide')
        {
            save[area] = [];
        }
        else if (behavior === 'custom')
        {
            var items = [];

            $links.each(function() {
                var $this = $(this);

                items.push({
                    label: $this.find('input[name="label"]').val(),
                    url: $this.find('input[name="url"]').val()
                });
            });
            save[area] = items;
        }
        else
        {
            return true;
        }
    });

    $helpLinksInput.val(JSON.stringify(save));

    return true;
});

function addButton(label, url, $container)
{
    var $html = $(buttonTemplate());
    $html.find('input[name="label"]').val(label);
    $html.find('input[name="url"]').val(url);
    $container.append($html);
}