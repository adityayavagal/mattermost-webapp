// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {createSelector} from 'reselect';

import {getSortedUnreadChannelIds, getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';
import {makeGetCategoriesForTeam, makeGetChannelsForCategory} from 'mattermost-redux/selectors/entities/channel_categories';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {GenericAction} from 'mattermost-redux/types/actions';
import {ChannelCategory} from 'mattermost-redux/types/channel_categories';
import {Channel} from 'mattermost-redux/types/channels';

import {switchToChannelById} from 'actions/views/channel';
import {close} from 'actions/views/lhs';
import {isUnreadFilterEnabled} from 'selectors/views/channel_sidebar';
import {GlobalState} from 'types/store';

import SidebarCategoryList from './sidebar_category_list';

const getCategoriesForTeam = makeGetCategoriesForTeam();
const getChannelsForCategory = makeGetChannelsForCategory();

// TODO: Remove once Harrison's stuff is in
function getChannelsForCategoryFunc(state: GlobalState): (category: ChannelCategory) => Channel[] {
    return createSelector(
        () => state,
        (category: ChannelCategory) => category,
        (_, category) => {
            return getChannelsForCategory(state, category);
        }
    );
}

function mapStateToProps(state: GlobalState) {
    const lastUnreadChannel = state.views.channel.keepChannelIdAsUnread;
    const currentTeam = getCurrentTeam(state);

    return {
        currentTeam,
        currentChannel: getCurrentChannel(state),
        categories: getCategoriesForTeam(state, currentTeam.id),
        isUnreadFilterEnabled: isUnreadFilterEnabled(state),
        unreadChannelIds: getSortedUnreadChannelIds(state, lastUnreadChannel, false, false, 'alpha'),
        getChannelsForCategory: getChannelsForCategoryFunc(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            close,
            switchToChannelById,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarCategoryList);
