tippy('.app-domain-info', $.extend(tippySettingsTooltipMandatory, {
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