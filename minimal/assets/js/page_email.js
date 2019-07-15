// globals
var $aliasContainer = $('#app-add-alias-container');
var $emailDomainSelect = $('select[name="email_domain_id"]');
var aliasTemplate = Handlebars.compile($('#app-add-alias-template').html());
var $showWithCatchAll = $('#app-show-without-catchall');
var $showWithCheckSpam = $('#app-show-with-check-spam');

// show hide protections
$('input[name="is_catch_all"]').on('change', function() {
    var $this = $(this);

    if ($this.prop('checked'))
    {
        $showWithCatchAll.hide(200);
    }
    else
    {
        $showWithCatchAll.show(200);
    }
}).trigger('change');

// show / hide spam score
$('input[name="is_check_for_spam"]').on('change', function() {
    var $this = $(this);

    if ($this.prop('checked'))
    {
        $showWithCheckSpam.show(200);
    }
    else
    {
        $showWithCheckSpam.hide(200);
    }
}).trigger('change');

// add alias (on page load)
for (var i = 0; i < aliases.length; i++)
{
    addAlias(aliases[i]['name'], aliases[i]['id_domain']);
}

// add alias (on button click)
$('#app-btn-add-alias').on('click', function() {
    var idDomain;

    // pre-select the email domain, which is currently selected as account domain
    if ($emailDomainSelect.length > 0)
    {
        // on 'add'
        idDomain = $emailDomainSelect.val();
    }
    else
    {
        // on 'edit'
        idDomain = idEmailDomain;
    }

    addAlias('', idDomain);
});

// remove alias
$aliasContainer.on('click', '.app-btn-remove-alias', function() {
    $(this).closest('.columns').remove();
});

// submit
$('form').submit(function() {
    $('input[name=aliases]').val(JSON.stringify(getCurrentAliases()));
    return true;
});

//----------------------------------------------------------------------------------------------------------------------
// Functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Adds a new alias row to the container.
 *
 * @param    {string}   name
 * @param    {int}      idDomain
 * @returns  {Boolean}
 */
function addAlias(name, idDomain)
{
    var $html   = $(aliasTemplate());
    var $input  = $html.find('input');
    var $select = $html.find('select');

    if (name != '')
    {
        $input.val(name);
    }

    if (typeof(idDomain) !== 'undefined' && idDomain !== '')
    {
        // only on 'edit'

        if ($select.find('option[value="'+idDomain+'"]').length)
        {
            $select.val(idDomain);
        }
        else
        {
            // domain id is not valid, do not add a new alias
            return false;
        }
    }

    $aliasContainer.append($html);
}


/**
 * Returns an array of objects with all alias addresses.
 * Each object has a 'name' and a id_domain' property.
 *
 * @returns  {Array}
 */
function getCurrentAliases()
{
    var aliases = new Array();
    var i = 0;

    $aliasContainer.find('.columns').each(function() {
        var $this = $(this);
        var name = $this.find('input').val().trim();
        var idDomain = $(this).find('select').children(':selected').val().trim();

        if (name !== '')
        {
            aliases[i] = {
                name: name,
                id_domain: idDomain
            };
            i++;
        }
    });

    return aliases;
}