/**
 * Generates a random password.
 *
 * @returns  {string}
 */
function generatePassword()
{
    var length = typeof hash['password.generator_length'] !== 'undefined' ? hash['password.generator_length'] : 12;

    // Define all the characters, a password is build with.
    // To avoid confusion, we drop some similar characters (l, I, 1, 0, O)
    var characters = new Array();
    characters.push('abcdefghijkmnopqrstuvwxyz');
    characters.push('ABCDEFGHJKLMNPQRSTUVWXYZ');
    characters.push('23456789');
    characters.push('_!@#$%&*?');

    // generate the password
    var password = '';
    var allCharacters = '';

    // first, pick one character out of every character group
    for (var i = 0; i < characters.length; i++)
    {
        var position = Math.floor(Math.random() * characters[i].length);
        password += characters[i][position];
        allCharacters += characters[i];
    }

    // fill the password till it reach its maximum length with
    // random characters out of all available characters
    var remaining = length - characters.length;
    for (var i = 0; i < remaining; i++)
    {
        var position = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[ position ];
    }

    // shuffle
    var array = password.split("");
    var n = array.length;

    for (var i = n - 1; i > 0; i--)
    {
        var pos = Math.floor(Math.random() * (i + 1));

        var tmp = array[i];
        array[i] = array[pos];
        array[pos] = tmp;
    }

    password = array.join("");

    return password;
}


/**
 * Calculate the strength of a password ranging from 0 (bad) to 100 (good).
 *
 * @param    {string}   password
 * @returns  {integer}
 */
function calculatePasswordStrength(password)
{
    var strength = 0;

    strength += password.match(/[A-Z]+/) ? 12 : 0;
    strength += password.match(/[a-z]+/) ? 12 : 0;
    strength += password.match(/[0-9]+/) ? 12 : 0;
    strength += password.match(/[_\W]+/) ? 16 : 0; // underscore not matched by \W
    strength += password.length > 6 ? (password.length - 6) * 8 : 0;

    if (strength > 100)
    {
        strength = 100;
    }

    return strength;
}


/**
 * Offers an easier access to KeyHelps ajax functionality while setting all the required params.
 * Specify an object with all properties, you want to overwrite.
 * At least ajax({action: '<NAME_OF_THE_AJAX_FUNCTION>'}) is required.
 *
 * @param    {object}  params
 * @returns  {void}
 */
function ajax(params)
{
    var defaultParams = {
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        authId: hash['auth.id'],
        authSid: hash['auth.sid'],
        error: ajaxLogError
    };
    params = $.extend(defaultParams, params);

    var defaultData = {
        action: params.action,
        auth_id: params.authId,
        auth_sid: params.authSid
    };
    data = $.extend(defaultData, params.data);

    return $.ajax({
       url: params.url,
       type: params.type,
       dataType: params.dataType,
       data: data,
       success: params.success,
       error: params.error,
       beforeSend: params.beforeSend,
       complete: params.complete
    });
}


/**
 * Can be used as a uniform logger for ajax errors.
 *
 * Usage: "error: ajaxLogError"
 *
 * @param   {object}  textStatus
 * @param   {string}  error
 * @returns {void}
 */
function ajaxLogError(textStatus, error)
{
    console.log('AJAX-ERROR');
    console.log('Type: ' + error);
    console.log('Staus: ' + textStatus.status + ' - ' + textStatus.statusText);
    console.log('Response: ' + "\n" + textStatus.responseText);
}


/**
 * Sets the active tab.
 * Just specify the id of the tab, you want to set to active
 * and this function will take care of setting the correct classes to the tab links and panels.
 * The parameter accept both id notations - with and without '#' infront of it.
 *
 * @param    {string}  tabId
 * @returns  {void}
 */
function setActiveTab(tabId)
{
    // unify tabId - we accept ids with and without '#'.
    tabId = tabId.indexOf('#') === 0 ? tabId.substr(1) : tabId;

    // 1) update tab links (.tab a / .tab li)

    // find wrapping .tabs element
    var $tabs = $('.tabs a[href="#' + tabId + '"]').closest('.tabs');

    // tab links: set .is-active to the li element
    var $tabLinks = $tabs.find('a');

    $tabLinks.each(function() {
        var $link = $(this);
        var $li = $link.closest('li');
        // remove the '#'
        var linkTarget = $link.attr('href').substr(1);

        if (tabId === linkTarget)
        {
            $li.addClass('is-active');
        }
        else
        {
            $li.removeClass('is-active');
        }
    });


    // 2) update tab panels (.tab-panel)

    // tab panels: set .is-active to the .tabs-panel element
    var $tabPanels = $('#'+tabId).closest('.tabs-content').find('.tabs-panel');

    $tabPanels.each(function() {
        var $panel = $(this);

        if (tabId === $panel.attr('id'))
        {
            $panel.addClass('is-active');
        }
        else
        {
            $panel.removeClass('is-active');
        }
    });
}


/**
 * Copy the containing text of a given element selector to clipboard.
 *
 * @param    {string}  element  jQuery element / selector of the element, you want to copy from.
 * @returns  {boolean}
 */
function copyToClipboard(element)
{
    var $element = $(element);

    if ($element.length !== 1)
    {
        return false;
    }

    // setup $temp element
    var $temp = null;

    if ($element.is("input"))
    {
        $temp = $('<input>');
        $temp.val($element.val());
    }
    else if ($element.is("textarea"))
    {
        $temp = $('<textarea>');
        $temp.val($element.val());
    }
    else
    {
        $temp = $('<div>');
        $temp.val($element.text());
    }

    // create element
    $("body").append($temp);

    // select text
    if (window.navigator.userAgent.match(/ipad|iphone/i))
    {
        // https://stackoverflow.com/questions/40147676/javascript-copy-to-clipboard-on-safari
        range = document.createRange();
        range.selectNodeContents($temp[0]);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        $temp[0].setSelectionRange(0, 999999);
    }
    else
    {
        $temp.select();
    }

    // copy
    document.execCommand("copy");

    // remove
    $temp.remove();

    return true;
}

/**
 * Animates a button when clicked.
 *
 * @param    {type}       button  jQuery element / selector of the button, you want to animate
 * @returns  {undefined}
 */
function copyToClipboardButtonAnimation(button)
{
    var $button = $(button);
    var buttonHtml = button.html();
    var buttonWidth = button.width();

    // prevents double clicks
    if (button.hasClass('is-link'))
    {
        button.removeClass('is-link');
        button.addClass('is-success');
        button.html('<i class="fas fa-check"></i>');
        button.width(buttonWidth);

        setTimeout(function() {
            button.html(buttonHtml);
            button.addClass('is-link');
            button.removeClass('is-success');
        }, 1000);
    }
}

/**
 * Loads a preview of the image, the user is going to upload via an upload input field.
 *
 * @param    {object}   input            The javascript dom object of the input field.
 * @param    {type}     previewSelector  The DOM selector of the image element, the preview will be displayed.
 *                                       It also accepts jQuery Objects.
 * @returns  {Boolean}
 */
function loadPreviewImage(input, previewSelector)
{
    // accepts jQuery objects and string selectors.
    var $preview = $(previewSelector);

    if (input.files && input.files[0])
    {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function(e)
        {
            $preview.attr('src', e.target.result);
        };
        return true;
    }

    return false;
}

/**
 * Sets up a clock based on the server time which get synced via ajax.
 *
 * @param    {string}  selector  The DOM selector of the element, the clock should be displayed
 * @param    {string}  format
 * @returns  {void}
 */
function clock(selector, format)
{
    var $selector = $(selector);
    format = typeof format !== 'undefined' ? format : 'HH:mm:ss - DD. MMMM YYYY';

    if ($selector.length === 0)
    {
        return false;
    }

    var syncTimeMillisecs = 30250;
    var addToTimeMillisecs = 250;

    var time;

    moment.locale(hash['language']);

    var getTime = function() {
        ajax({
            action: 'get_time',
            success: function(response) {
                time = moment(response.time);
            }
        });
    };

    var countTime = function() {
        if (typeof time === 'undefined') { return; }

        time.add(addToTimeMillisecs, 'ms');
        $selector.text(time.format(format));
    };

    getTime();
    setInterval(getTime, syncTimeMillisecs);
    setInterval(countTime, addToTimeMillisecs);
}

/**
 * Gets the font size of the root element.
 *
 * @returns {unresolved}
 */
function getRootElementFontSize()
{
    return getElementFontSize();
}

/**
 * Gets the font size of a given element.
 *
 * @param    {DOM element}  context
 * @returns  {float}
 */
function getElementFontSize(context)
{
  return parseFloat(getComputedStyle(context || document.documentElement).fontSize);
}

/**
 * Converts the rem value to pixel based on the root element.
 *
 * @param    {float}  value
 * @returns  {float}
 */
function convertRemToPixel(value)
{
  return value * getRootElementFontSize();
}

/**
 * Converts the em value to pixel based on a context element.
 *
 * @param    {float}        value
 * @param    {DOM element}  context
 * @returns  {float}
 */
function convertEmToPixel(value, context)
{
  return value * getElementFontSize(context);
}

/**
 * Read the query parameters of a URL and return them as array object (key / value).
 *
 * @param    {string} url
 * @returns  {array}
 */
function getUrlQueryParameters(url)
{
    var vars = [], parameter;
    var queryParameters = url.slice(url.indexOf('?') + 1).split('&');

    for (var i = 0; i < queryParameters.length; i++)
    {
        parameter = queryParameters[i].split('=');
        vars.push(parameter[0]);
        vars[parameter[0]] = parameter[1];
    }

    return vars;
}

/**
 * Reads the query parameters of a URL and return the value of the query parameter with the specified name
 * or false, if it does not exists.
 *
 * @param    {string}          url
 * @param    {string}          name
 * @returns  {boolean|string}
 */
function getUrlQueryParameterValue(url, name)
{
    var parameters = getUrlQueryParameters(url);
    return typeof parameters[name] !== 'undefined' ? parameters[name] : false;
}