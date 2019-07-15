//----------------------------------------------------------------------------------------------------------------------
// meta
//----------------------------------------------------------------------------------------------------------------------

    var action = $('form').prop('action').indexOf('action=add') !== -1 ? 'add' : 'edit';
    var area = hash['app.area'] === 'admin' ? 'admin' : 'user';

//----------------------------------------------------------------------------------------------------------------------
// general
//----------------------------------------------------------------------------------------------------------------------

// show / hide domain target settings
$('input[name="target_type"]').on('change', function() {
    var $this = $(this);
    var $showWithDirectory = $('#app-show-with-directory');
    var $showWithUrl = $('#app-show-with-url');

    if ($this.is(':checked'))
    {
        if ($this.val() === 'directory')
        {
            $showWithDirectory.show(200);
            $showWithUrl.hide(200);
        }
        else
        {
            $showWithDirectory.hide(200);
            $showWithUrl.show(200);
        }
    }
}).trigger('change');


// show / hide security options based on the certificate type
$('input[name="certificate_type"]').on('change', function() {
    var $this = $(this);
    var $showWithTypeCustom = $('#app-show-with-type-custom');
    var $showWithCertificate = $('#app-show-with-certificate');

    if ($this.is(':checked'))
    {
        if ($this.val() === 'lets_encrypt' || $this.val() === 'custom')
        {

            $showWithCertificate.show(200);
        }
        else
        {
            $showWithCertificate.hide(200);
        }

        if ($this.val() === 'custom')
        {
            $showWithTypeCustom.show(200);
        }
        else
        {
            $showWithTypeCustom.hide(200);
        }
    }
}).trigger('change');


// show / hide cgi options
$('input[name="cgi_path_type"]').on('change', function() {
    var $this = $(this);
    var $showWithCgiPathTypeCustom = $('#app-show-with-cgi-path-type-custom');

    if ($this.val() === 'custom' && $this.is(':checked'))
    {
        $showWithCgiPathTypeCustom.show(200);
    }
    else
    {
        $showWithCgiPathTypeCustom.hide(200);
    }
}).trigger('change');


//----------------------------------------------------------------------------------------------------------------------
// only add
//----------------------------------------------------------------------------------------------------------------------

if (action === 'add')
{
    // show / hide domain name input variants
    $('input[name="domain_type"]').on('change', function() {
        var $this = $(this);

        var $showWithMainDomain = $('#app-show-with-main-domain');
        var $showWithSubdomain = $('#app-show-with-subdomain');
        //var $showWithMultiple = $('#app-show-with-multiple');
        var $createWwwSubdomain = $('#app-create-www-subdomain');
        // only admin
        var $isEmailDomain = $('input[name="is_email_domain"]');

        if ($this.is(':checked'))
        {
            if ($this.val() === 'main_domain')
            {
                $showWithMainDomain.show(200);
                $showWithSubdomain.hide(200);
                //$showWithMultiple.hide(200);
                $createWwwSubdomain.show(200);

                if (area === 'admin')
                {
                    $isEmailDomain.prop('checked', true);
                }
            }
            else if ($this.val() === 'subdomain')
            {
                $showWithMainDomain.hide(200);
                $showWithSubdomain.show(200);
                //$showWithMultiple.hide(200);
                $createWwwSubdomain.hide(200);

                if (area === 'admin')
                {
                    $isEmailDomain.prop('checked', false);
                }
            }
            else
            {
                $showWithMainDomain.hide(200);
                $showWithSubdomain.hide(200);
                //$showWithMultiple.show(200);
                $createWwwSubdomain.show(200);

                if (area === 'admin')
                {
                    $isEmailDomain.prop('checked', true);
                }
            }
        }
    }).trigger('change');


    // update php version, when switching to domain type subdomain
    var $phpInterpreter = $('select[name="php_interpreter"]');
    if ($phpInterpreter.length)
    {
        var initialPhpVersion = $phpInterpreter.val();

        $('input[name="domain_type"]').on('change', function() {
            var $this = $(this);

            if ($this.is(':checked'))
            {
                if ($this.val() === 'subdomain')
                {
                    initialPhpVersion = $phpInterpreter.val();
                    $phpInterpreter.val(['like_main']);
                }
                else
                {
                    $phpInterpreter.val([initialPhpVersion]);
                }
            }
        });
    }
}