// task type
$('input[type=radio][name="type"]').on('change', function() {
    if (this.checked)
    {
        var $allParentContainer = $('[class^="app-command-"]');
        var $activeContainer = $('[class^="app-command-' + this.value + '"]');

        $allParentContainer.hide(0);
        $allParentContainer.find('input').prop('required',false);

        $activeContainer.show(200);
        $activeContainer.find('input').prop('required',true);
    }
}).trigger('change');


// interval
var intervalElements = {
    minute:         $('.app-schedule-minute'),
    day_of_week:    $('.app-schedule-day-of-week'),
    day_of_month:   $('.app-schedule-day-of-month'),
    month:          $('.app-schedule-month'),
    time:           $('.app-schedule-time'),
    cron_style:     $('.app-schedule-cron-style')
};

var visibilityByInterval = {
    hourly:     ['minute'],
    daily:      ['time'],
    weekly:     ['day_of_week', 'time'],
    monthly:    ['day_of_month', 'time'],
    yearly:     ['day_of_month', 'month', 'time'],
    cron_style: ['cron_style']
};

$('select[name="interval"]').on('change', function() {
    var $this = $(this);
    var visibleElements = visibilityByInterval[$this.val()];

    if (visibleElements !== undefined)
    {
        for (var key in intervalElements)
        {
            if ($.inArray(key, visibleElements) !== -1)
            {
                intervalElements[key].show(200);
            }
            else
            {
                intervalElements[key].hide();
            }
        }
    }
}).trigger('change');


// notification type
$('input[type=radio][name="notification"]').on('change', function() {
    var $notificationEmail = $('.app-notification-email');

    if (this.value !== 'never' && this.checked)
    {
        $notificationEmail.show(200);
        $notificationEmail.find('input[name=email]').prop('type', 'email').prop('required', true);
    }
    else
    {
        $notificationEmail.hide(200);
        $notificationEmail.find('input[name=email]').prop('type', 'text').prop('required', false);
    }
}).trigger('change');