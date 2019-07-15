//----------------------------------------------------------------------------------------------------------------------
// Tooltip DKIM record
//----------------------------------------------------------------------------------------------------------------------

tippy('.app-dkim-info', $.extend(tippySettingsTooltipMandatory, {
    onShown: function(instance) {
        // like the function in main.js. unfortunatly we have to write it here again
        // maybe we come to a nicer solution some day
        $('.app-copy-to-clipboard').on('click', function() {
            var $this = $(this);
            var $input = $this.closest('.field').find('input');
            copyToClipboard($input);
            copyToClipboardButtonAnimation($this);
        });
    }
}));

//----------------------------------------------------------------------------------------------------------------------
// Add / Remove records
//----------------------------------------------------------------------------------------------------------------------

var recordTemplate = Handlebars.compile($('#app-record-template').html());
var $recordContainer = $('#app-record-container');
var $addRecord = $('.app-add-record');
var $applyTtlToAll = $('#app-apply-ttl-to-all');
var $form = $('#app-edit-dns-form');

// on pageload, add records
for (var i = 0; i < records.length; i++)
{
    addRecord(records[i].host, records[i].ttl, records[i].type, records[i].value);
}

// on button clicked, add record
$addRecord.on('click', function() {
    addRecord();
});

// on button clicked, remove record
$recordContainer.on('click', '.app-remove-record', function() {
    $(this).closest('tr').remove();
});

// apply ttl value to all
$applyTtlToAll.on('click', function() {
    $recordContainer.find('input[name="ttl"]').val(getTimeToLife());
});

// submit
$form.submit(function() {
    $('input[name=records]').val(JSON.stringify(getCurrentRecords()));
    return true;
});

// functions -------------------------------------------------------------------------------------------------------

/**
 * Adds a new record row to the defined location inside of container.
 *
 * @param   {string}   host
 * @param   {string}   ttl
 * @param   {string}   type
 * @param   {string}   value
 * @returns {boolean}
 */
function addRecord(host, ttl, type, value)
{
    var $html = $(recordTemplate());

    if (typeof(host) !== 'undefined')
    {
        $html.find('input[name="host"]').val(host);
    }

    if (typeof(ttl) === 'undefined' || ttl === '')
    {
        $html.find('input[name="ttl"]').val(getTimeToLife());
    }
    else
    {
        $html.find('input[name="ttl"]').val(ttl);
    }

    if (typeof(type) !== 'undefined')
    {
        $html.find('select').val(type);
    }

    if (typeof(value) !== 'undefined')
    {
        $html.find('input[name="value"]').val(value);
    }

    $recordContainer.find('#app-add-records-before').before($html);

    return true;
}

/**
 * Gets the current soa ttl value.
 *
 * @returns  {int}
 */
function getTimeToLife()
{
    return $('input[name="soa_ttl"]').val();
}

/**
 * Returns an array of objects with all records.
 * Each object has a 'host', 'ttl', 'type', 'value' property.
 *
 * @returns  {Array}
 */
function getCurrentRecords()
{
    var records = new Array();
    var i = 0;

    $recordContainer.find('.app-record-row').each(function() {
        var $this = $(this);

        var host  = $this.find('input[name="host"]').val().trim();
        var ttl   = $this.find('input[name="ttl"]').val().trim();
        var type  = $this.find('select[name="type"]').val();
        var value = $this.find('input[name="value"]').val().trim();

        records[i] = {
            host: host,
            ttl: ttl,
            type: type,
            value: value
        };
        i++;
    });

    return records;
}
