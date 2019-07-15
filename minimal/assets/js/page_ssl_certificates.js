var requiredFields = ['state', 'locality', 'organization', 'domain', 'email'];

var $showWithCsr = $('.app-show-with-csr');
var $showWithSelfSigned = $('.app-show-with-self-signed');
var $showWithUpload = $('.app-show-with-upload');

// show or hide the ssl/tls creation form
$('input[type="radio"][name="add_type"]').on('change', function() {
    var $this = $(this);

    if ($this.is(':checked'))
    {
        $showWithCsr.hide();
        $showWithSelfSigned.hide();
        $showWithUpload.hide();

        // update required
        if ($this.val() === 'upload')
        {
            for (var i = 0; i < requiredFields.length; i++)
            {
                $('input[name="' + requiredFields[i] + '"]').prop('required', false);
            }
        }
        else
        {
            for (var i = 0; i < requiredFields.length; i++)
            {
                $('input[name="' + requiredFields[i] + '"]').prop('required', true);
            }
        }

        // show / hide
        if ($this.val() === 'upload')
        {
            $showWithUpload.show();
        }
        else if ($this.val() === 'self_signed')
        {
            $showWithSelfSigned.show();
        }
        else
        {
            $showWithCsr.show();
        }
    };

}).trigger('change');