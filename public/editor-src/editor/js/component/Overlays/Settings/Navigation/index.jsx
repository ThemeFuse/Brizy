'use strict';

var _ = require('underscore'),
    React = require('react'),
    Pages = require('visual/global/Pages'),
    Globals = require('visual/global/Globals'),
    ProjectUtils = require('visual/helper/utils/ProjectUtils'),
    MenuBuilder = require('./MenuBuilder'),
    getMenus = require('visual/helper/utils/MenuUtils').getMenus;


function getState() {
    return {
        pages: Pages.getPages(),
        menus: getMenus()
    };
}

class Navigation extends React.Component {
    state = getState();

    componentWillMount() {
        this.onMenusChanged = _.debounce((changedMenus) => {
            Globals.set('menus', changedMenus, 'language');
        }, 1000);
    }

    componentDidMount() {
        Pages.addChangeListener(this.onPagesChange);
    }

    componentWillUnmount() {
        Pages.removeChangeListener(this.onPagesChange);
    }

    onAddNewPage = (title) => {
        Pages.addPage({
            title: title,
            type: ProjectUtils.isMultiPage() ? Pages.pageTypes.internal : Pages.pageTypes.anchor
        });
    };

    onDeletePage = (pageId) => {
        // TODO: make it like so when there will be time to refactor
        // 1. remove page from menus
        // 2. save page
        // 3. set state with new menus
        // 4. save globals

        Pages.deletePage(pageId);
    };

    onPagesChange = () => {
        this.setState(getState());
    };

    onUpdatePage = (pageId, data) => {
        Pages.updatePage(pageId, data);

        // trigger a menu change for all the menu blocks
        // could redraw themselves with the potential new data
        // (new title, or new slug)
        Globals.emitChange('menus');
    };

    render() {
        return (
            <MenuBuilder
                pages={this.state.pages}
                menus={this.state.menus}
                onAddNewPage={this.onAddNewPage}
                onUpdatePage={this.onUpdatePage}
                onDeletePage={this.onDeletePage}
                onMenusChanged={this.onMenusChanged}
            />
        );
    }
}

export default Navigation;
