//======================================================================================================================
// Page variables
//======================================================================================================================

// divs
var $twoFactorDivMethod     = $('#app-two-factor-method');
var $twoFactorDivNewApp     = $('#app-two-factor-new-app');
var $twoFactorDivAppSetup   = $('#app-two-factor-app-setup');
var $twoFactorDivAuthCode   = $('#app-two-factor-auth-code');
// inputs
var $twoFactorIsEnabled     = $('input[name="two_factor_is_enabled"]');
var $twoFactorAuthCodeInput = $twoFactorDivAuthCode.find('input');
// buttons
var $twoFactorNewApp        = $twoFactorDivNewApp.find('button');
// values
var twoFactorIsLoaded       = $('input[name="two_factor_is_loaded"]').val() === '1';

//======================================================================================================================
// On page load
//======================================================================================================================

twoFactorIsLoaded ? $twoFactorDivNewApp.show() : $twoFactorDivNewApp.hide();

//======================================================================================================================
// Event listeners
//======================================================================================================================

$twoFactorIsEnabled.on('change', function() {
   if (this.checked)
   {
        $twoFactorDivMethod.show(200);

        twoFactorIsLoaded ? $twoFactorDivAppSetup.hide() : $twoFactorDivAppSetup.show();
        twoFactorIsLoaded ? hideAuthCode() : showAuthCode();
   }
   else
   {
        $twoFactorDivMethod.hide();
        $twoFactorDivAppSetup.hide();

        twoFactorIsLoaded ? showAuthCode() : hideAuthCode();
   }
}).trigger('change');

// only with already enabled two-factor auth
$twoFactorNewApp.on('click', function() {
    if ($twoFactorDivAppSetup.is(':visible'))
    {
        $twoFactorDivAppSetup.hide();
        hideAuthCode();
    }
    else
    {
        $twoFactorDivAppSetup.show(200);
        showAuthCode();
    }
});


//======================================================================================================================
// Page functions
//======================================================================================================================

function showAuthCode()
{
    $twoFactorDivAuthCode.show(200);
    $twoFactorAuthCodeInput.prop('required', true);
}

function hideAuthCode()
{
    $twoFactorDivAuthCode.hide(200);
    $twoFactorAuthCodeInput.prop('required', false);
}