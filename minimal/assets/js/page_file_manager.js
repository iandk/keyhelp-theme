// =====================================================================================================================
// Trigger
// =====================================================================================================================

    tippy('.app-extended-menu', $.extend(tippySettingsTooltipMandatory, {
        onShown: function(instance) {

            // rename
            $('.app-modal-rename-trigger').on('click', function() {
                initRename(this);
            });

            // permission
            $('.app-modal-permissions-trigger').on('click', function() {
                initPermissions(this);
            });

            // extract
            $('.app-modal-extract-trigger').on('click', function() {
                initExtract(this);
            });

            // delete
            $('.app-modal-delete-trigger').on('click', function() {
                initDelete(this);
            });

        }})
    );

// =====================================================================================================================
// Rename
// =====================================================================================================================

    function initRename(trigger)
    {
        var $trigger = $(trigger);
        var $modal = $('#app-modal-rename');
        var $config = $trigger.closest('div').find('.app-configuration');
        var id = $config.find('input[name="id"]').val();
        var currentPath = $config.find('input[name="path"]').val();

        // set values
        $modal.find('.app-current-path').text(currentPath);
        $modal.find('input[name="name"]').val(id);
        $modal.closest('form').find('input[name="id"]').val(id);

        $modal.addClass('is-active');
    }

// =====================================================================================================================
// Permissions
// =====================================================================================================================

    function initPermissions(trigger)
    {
        var $trigger = $(trigger);
        var $modal = $('#app-modal-permissions');
        var $configurator = $('#app-permissions-configurator');
        var $config = $trigger.closest('div').find('.app-configuration');

        var id = $config.find('input[name="id"]').val();
        var currentPath = $config.find('input[name="path"]').val();
        var permissions = $config.find('input[name="permissions"]').val();

        // event listener
        $configurator.find('input[type="checkbox"]').on('change', function() {
            updatePermissions('checkbox', $configurator);
        });

        $configurator.find('input[type="number"]').on('change', function() {
            updatePermissions('number', $configurator);
        });

        // set values + trigger initial change event
        $modal.find('.app-current-path').text(currentPath);
        $modal.closest('form').find('input[name="id"]').val(id);

        $configurator.find('input[name="owner"]').val(permissions[0]);
        $configurator.find('input[name="group"]').val(permissions[1]);
        $configurator.find('input[name="others"]').val(permissions[2]).trigger('change');

        $modal.addClass('is-active');
    }


    function updatePermissions(reference, $configurator)
    {
        var levels = { owner: 0, group: 0, others: 0 };

        //          0   1   2   3   4   5   6   7
        // read     0   0   0   0   x   x   x   x       0100
        // write    0   0   x   x   0   0   x   x       0010
        // execute  0   x   0   x   0   x   0   x       0001
        var actions = { read: 4, write: 2, execute: 1 };

        if (reference === 'checkbox')
        {
            $.each(levels, function(level, levelValue) {
                $.each(actions, function(action, actionValue) {
                    var selector = 'input[name="' + level + '_' + action + '"]';
                    var checkbox = $configurator.find(selector);

                    if (checkbox.prop('checked'))
                    {
                        levels[level] = levels[level] | actionValue;
                    }
                });

                $configurator.find('input[name="' + level + '"]').val(levels[level]);
            });
        }

        if (reference === 'number')
        {
            $.each(levels, function(level, levelValue) {
                var a = $configurator.find('input[name="' + level + '"]').val();

                $.each(actions, function(action, actionValue) {
                    var selector = 'input[name="' + level + '_' + action + '"]';
                    var checkbox = $configurator.find(selector);

                    var isChecked = (a & actionValue) !== 0;
                    checkbox.prop('checked', isChecked);
                });
            });
        }
    }

// =====================================================================================================================
// Extract archive
// =====================================================================================================================

    function initExtract(trigger)
    {
        var $trigger = $(trigger);
        var $modal = $('#app-modal-extract');
        var $config = $trigger.closest('div').find('.app-configuration');
        var id = $config.find('input[name="id"]').val();
        var currentPath = $config.find('input[name="path"]').val();

        // set values
        $modal.find('.app-current-path').text(currentPath);
        $modal.closest('form').find('input[name="id"]').val(id);

        $modal.addClass('is-active');
    }

// =====================================================================================================================
// Delete single item
// =====================================================================================================================

    function initDelete(trigger)
    {
        var $trigger = $(trigger);
        var $modal = $('#app-modal-delete-single');
        var $config = $trigger.closest('div').find('.app-configuration');
        var id = $config.find('input[name="id"]').val();
        var currentPath = $config.find('input[name="path"]').val();

        // set values
        $modal.find('.app-current-path').text(currentPath);
        $modal.closest('form').find('input[name="id"]').val(id);

        $modal.addClass('is-active');
    }