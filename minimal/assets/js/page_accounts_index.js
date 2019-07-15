tippy('.app-tooltip-user-info', $.extend(tippySettingsTooltipMandatory, {
    content: '...',
    flipOnUpdate: true,
    onShow: function(instance) {
        var userId = $(instance.reference).data('user-id');

        ajax({
            action: 'get_userinfo',
            data:
            {
                user_id: userId
            },
            success: function(response)
            {
                var html;

                if (response.error)
                {
                    html = response.error_msg.replace(/\n/, '<br>');
                }
                else
                {
                    html = '<div class="table-container">';
                    html+= '  <table class="table is-narrow is-fullwidth">';

                    for (var key in response.info)
                    {
                        var info = response.info[key];

                        if (key === 'permissions' || key === 'main_domains')
                        {
                            if (info.value.length > 0)
                            {
                                var style = '';
                                var showDomains = 3;
                                var remainingDomains = info.value.length - showDomains;
                                remainingDomains = remainingDomains < 0 ? 0 : remainingDomains;

                                html+= '<tr>';
                                html+= '  <td colspan="2">';
                                html+= '    <span class="has-text-dark has-text-weight-bold">' + info.label + '</span><br>';

                                var isLast = false;
                                for (var i = 0; i < info.value.length; i++)
                                {
                                    isFirst = i === 0;
                                    isLast = i === info.value.length - 1;

                                    if (key === 'main_domains')
                                    {
                                        style = i >= showDomains ? 'style="display: none;" class="app-hidden-domain"' : '';
                                        html+= '<span ' + style + '>' +
                                               (isFirst ? '' : ', ') +
                                               '<a href="http://' + info.value[i] + '" target="_blank" rel="nofollow noopener noreferrer">' + info.value[i] + '</a>'+
                                               '</span>';
                                    }
                                    else
                                    {
                                        html+= '      ' + info.value[i] + (isLast ? '' : ', ');
                                    }
                                }

                                if (key === 'main_domains' && remainingDomains > 0)
                                {
                                    html+='    <br><a class="app-show-more-domains" href="javascript:void(0)">&hellip; ' + hash['lang.show_more'] + ' (' + remainingDomains + ')</a>';
                                }

                                html+= '  </td>';
                                html+= '</tr>';
                            }
                        }
                        else
                        {
                            html+= '<tr>';
                            html+= '  <th class="has-no-wrap">' + info.label + '</th>';
                            html+= '  <td class="has-no-wrap">' + info.value + '</td>';
                            html+= '</tr>';
                        }
                        html+= "\n";
                    }

                       html+= '  </table>';
                       html+= '</div>';
                }

                $html = $(html);
                $html.find('.app-show-more-domains').on('click', function() {
                    $(this).remove();
                    $('body .app-hidden-domain').show(0);
                });

                instance.setContent($html[0]);
            },
            error: function(textStatus, error)
            {
                instance.setContent('AJAX_ERROR');
                ajaxLogError(textStatus, error);
            }
        });
    },
    onHidden: function(instance) {
        instance.setContent('...');
    }
}));