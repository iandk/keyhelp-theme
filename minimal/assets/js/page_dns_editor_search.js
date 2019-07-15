var domainTemplate = Handlebars.compile($('#app-domain-template').html());
var $search = $('input[name="search"]');
var $domainContainer = $('#app-domain-container');
var $noItems = $('#app-no-items-available');
var $itemTable = $('#app-item-table');

// on page load, build domain list
if (domains.length === 0)
{
    $noItems.show(200);
}
else
{
    $itemTable.show(200);

    for (var i in domains)
    {
        $domainContainer.append(domainTemplate({
            id: domains[i].id,
            domain: domains[i].domain_utf8,
            is_modified: domains[i].is_modified
        }));
    }
}

// on search
$search.on('input', function() {
    var ids = filterDomains($search.val(), domains);

    if (ids.length === 0)
    {
        $noItems.show(200);
        $itemTable.hide();
    }
    else
    {
        $noItems.hide();
        $domainContainer.html('');
        $itemTable.show(200);

        for (var i in domains)
        {
            if (ids.indexOf(domains[i].id) !== -1)
            {
                $domainContainer.append(domainTemplate({
                    id: domains[i].id,
                    domain: domains[i].domain_utf8,
                    is_modified: domains[i].is_modified
                }));
            }
        }
    }
});

// function --------------------------------------------------------------------------------------------------------

/**
* Filter the list of domains by a search string 'filter'.
*
* @param    {type}   filter
* @param    {type}   domains
* @returns  {Array}
*/

function filterDomains(filter, domains)
{
   var ids = [];
   var found, item;
   var hasWildcard = filter.indexOf('*') > -1;

   // find matches
   for (var i in domains)
   {
       found = false;
       item = domains[i];

       searchArray = [item.domain];
       if (item.domain !== item.domain_utf8)
       {
           searchArray.push(item.domain_utf8);
       };

       for (var j in searchArray)
       {
           var search = searchArray[j];

           if (hasWildcard && matchWildcard(filter, search))
           {
               found = true;
               break;
           }
           else if (search.indexOf(filter) > -1)
           {
               found = true;
               break;
           }
       }

       if (found === true)
       {
           ids.push(item.id);
       }
   }

   return ids;
}

/**
 * Checks if there is a wildcard sign (*) inside of the string.
 *
 * @param    {string}   string
 * @returns  {boolean}
 */
function isWildcard(string)
{
    return string.indexOf('*') > -1;
}

/**
 * Searches the haystack 'string' by using the needle 'rule' (with wildcard).
 *
 * @param    {string}   rule
 * @param    {string}   string
 * @returns  {boolean}
 */
function matchWildcard(rule, string)
{
    // ".+" => Matches any string that contains one or more characters
    rule = rule.split("*").join(".+");

    // create a regular expression object for matching string
    var regex = new RegExp(rule);

    // returns true if it finds a match, otherwise false
    return regex.test(string);
}
