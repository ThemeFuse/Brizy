var _ = require("underscore"),
  React = require("react"),
  PageSettings = require("./PageSettings"),
  AddNewPage = require("./AddNewPage"),
  SizeMonitor = require("visual/component/SizeMonitor"),
  ScrollPane = require("visual/component/ScrollPane"),
  AutoScroll = require("visual/component/dragdrop/AutoScroll"),
  Sortable = require("visual/component/dragdrop/Sortable"),
  SortableTree = require("visual/component/dragdrop/SortableTree"),
  TreeDepthLimitInsertionPointFinder = require("visual/helper/dragdrop/insertionPoint/TreeDepthLimitInsertionPointFinder"),
  arrayInsertion = require("visual/helper/dragdrop/arrayInsertion"),
  treeInsertion = require("visual/helper/dragdrop/treeInsertion"),
  treeFind = require("visual/helper/dragdrop/treeFind"),
  pageTypes = require("visual/global/Pages").pageTypes,
  ProjectUtils = require("visual/helper/utils/ProjectUtils");

function removeItemFromTree(tree, itemPath) {
  var treeItem = treeFind(tree, itemPath);
  var treeItemParent = treeFind(tree, itemPath.slice(0, -1));

  // remove the item from it's parent and append
  // the item's children to the parent
  treeItemParent.children.splice.apply(
    treeItemParent.children,
    [itemPath[itemPath.length - 1], 1].concat(treeItem.children)
  );

  return tree;
}

function arrayInsertionToTreeInsertion(insertion) {
  return { pageId: insertion.id, children: [] };
}

class MenuBuilder extends React.Component {
  static defaultProps = {
    pages: [],
    menus: [],
    onAddNewPage: function() {},
    onUpdatePage: function() {},
    onDeletePage: function() {},
    onMenusChanged: function() {}
  };

  state = {
    menus: this.props.menus,
    autoScrollActive: false,
    settings: {
      show: false,
      page: null
    },
    dd: {
      source: null,
      target: null,
      insertion: null
    }
  };

  componentWillMount() {
    this.multiPageMode = ProjectUtils.isMultiPage();
  }

  componentWillReceiveProps(nextProps) {
    // (temp hack) used for menus render, to easily get the page data by an id
    // TODO: review when will have more time
    this.pagesMap = _.reduce(
      nextProps.pages,
      function(acc, page) {
        acc[page.id] = {
          title: page.title,
          type: page.type,
          index: page.index
        };
        return acc;
      },
      {}
    );

    // checking if all the pages in the menus are valid
    // they can be invalid when deleted from their settings
    var needToSaveMenus = false;
    var self = this;
    var menus = _.map(this.state.menus, function(menu) {
      var loopAgain;
      do {
        loopAgain = false;
        var invalidItemPath = findInvalidInChildren(menu, []);
        if (invalidItemPath) {
          removeItemFromTree(menu, invalidItemPath);
          loopAgain = true;
          needToSaveMenus = true;
        }
      } while (loopAgain);

      return menu;

      function findInvalidInChildren(item, path) {
        return _.reduce(
          item.children,
          function(acc, child, index) {
            if (acc) {
              return acc;
            }
            if (!self.pagesMap[child.pageId]) {
              return path.concat(index);
            }
            return findInvalidInChildren(child, path.concat(index));
          },
          null
        );
      }
    });

    if (needToSaveMenus) {
      this.setState({ menus: menus }, this.saveMenus);
    }
  }

  activateAutoScroll = active => {
    this.setState({ autoScrollActive: active });
  };

  closePageSettings = () => {
    this.setState({
      settings: {
        show: false,
        page: null
      }
    });
  };

  handleChangeSize = () => {
    this.refs["scrollpane"].forceUpdate();
  };

  handleFeedbackPointer = (x, y) => {
    var dd = this.state.dd;
    if (dd.target !== "pages") {
      this.refs[dd.target].updateInsertionPoint(x, y);
    }
  };

  handleMenusChange = (menuId, value) => {
    var menus = this.state.menus,
      menu = _.find(menus, function(menu) {
        return menu.id === menuId;
      });

    menus[menus.indexOf(menu)] = value;
    this.setState({ menus: menus }, this.saveMenus);
  };

  handleMenusMouseEnter = menuId => {
    var dd = this.state.dd;

    if (!dd.insertion) {
      return;
    }

    if (dd.source === "pages") {
      if (dd.target !== "pages") {
        this.refs[dd.target].setState({ insertion: null });
      }
      this.refs[menuId].setState({
        insertion: arrayInsertionToTreeInsertion(dd.insertion[0])
      });
    } else {
      this.refs[dd.target].setState({ insertion: null });
      this.refs[menuId].setState({ insertion: dd.insertion });
    }
    this.setState({
      dd: _.extend({}, dd, { target: menuId })
    });
  };

  handleMouseUp = () => {
    var dd = this.state.dd;
    this.refs[dd.source].commit();
    this.refs[dd.target].commit();
    this.setState({
      dd: {
        source: null,
        target: null,
        insertion: null
      }
    });
  };

  menusMouseDown = (target, sortable, elem, path, event) => {
    var selection = path,
      insertion = treeInsertion(sortable.props.root, selection),
      insertionPoint = path,
      feedbackProps = {
        onPointer: this.handleFeedbackPointer,
        onMouseUp: this.handleMouseUp
      };
    sortable.start(
      selection,
      insertion,
      insertionPoint,
      elem,
      event,
      feedbackProps
    );
    this.setState({
      dd: {
        source: target,
        target: target,
        insertion: insertion
      }
    });
    event.preventDefault();
  };

  multiPageMode = null;

  openPageSettings = pageId => {
    var page = _.find(this.props.pages, function(page) {
      return page.id === pageId;
    });
    this.setState({
      settings: {
        show: true,
        page: page
      }
    });
  };

  pagesMap = null;

  pagesMouseDown = (sortable, elem, index, event) => {
    var selection = [index],
      insertion = arrayInsertion(sortable.props.items, selection),
      insertionPoint = index,
      feedbackProps = {
        onPointer: this.handleFeedbackPointer,
        onMouseUp: this.handleMouseUp
      };
    sortable.start(
      selection,
      insertion,
      insertionPoint,
      elem,
      event,
      feedbackProps
    );
    this.setState({
      dd: {
        source: "pages",
        target: "pages",
        insertion: insertion
      }
    });
    event.preventDefault();
  };

  removeItemFromMenu = (menuId, itemPath) => {
    var menus = this.state.menus,
      menu = _.find(menus, function(menu) {
        return menu.id === menuId;
      });

    removeItemFromTree(menu, itemPath);

    this.setState({ menus: menus }, this.saveMenus);
  };

  saveMenus = () => {
    this.props.onMenusChanged(JSON.parse(JSON.stringify(this.state.menus)));
  };

  wrapScrollable = item => {
    return (
      <AutoScroll active={this.state.autoScrollActive} capture={true}>
        {item}
      </AutoScroll>
    );
  };

  renderMenu = (menu, index) => {
    var className = "",
      id = menu.id,
      maxDepth = menu.multiLevel ? 3 : 1;
    return (
      <div className={"menu-container " + className} key={index}>
        <h3 className="brz-h3">{menu.title}</h3>
        <SortableTree
          ref={id}
          root={menu}
          insertionPointFinder={TreeDepthLimitInsertionPointFinder.bind(
            null,
            maxDepth
          )}
          renderContainer={this.renderMenusContainer}
          renderItem={this.renderMenusItem}
          onMouseEnter={this.handleMenusMouseEnter.bind(null, id)}
          onForwardMouseDown={this.menusMouseDown.bind(null, id)}
          onChange={this.handleMenusChange.bind(null, id)}
          onChangeState={this.activateAutoScroll}
        />
      </div>
    );
  };

  renderMenus = () => {
    // (temp hack) used for menus render, to easily get the page data by an id
    // this is done for the FIRST TIME ONLY, the rest of the time it is done in
    // componentWillReceiveProps
    // TODO: review when will have more time
    if (!this.pagesMap) {
      this.pagesMap = _.reduce(
        this.props.pages,
        function(acc, page) {
          acc[page.id] = {
            title: page.title,
            type: page.type,
            index: page.index
          };
          return acc;
        },
        {}
      );
    }

    var menus = _.map(this.state.menus, this.renderMenu);
    return (
      <div className="brz-ed-large-popup-navigation-menus">
        <div className="brz-ed-large-popup-navigation-menus-inner">{menus}</div>
      </div>
    );
  };

  renderMenusContainer = (sortable, children, isRoot) => {
    if (isRoot && !children.length) {
      return (
        <ol className="brz-ol brz-ed-nav-empty-list">
          <li className="brz-li brz-ed-nav-empty-inner">
            Drag &amp; Drop {this.multiPageMode ? "pages" : "anchors"} here<br />
            to create menu
          </li>
          {sortable.getSelection()
            ? sortable.renderFeedback(this.state.dd.insertion)
            : null}
        </ol>
      );
    } else {
      return (
        <ol className={isRoot ? "brz-ol brz-ed-nav-root-list" : ""}>
          {children}
          {isRoot && sortable.getSelection()
            ? sortable.renderFeedback(this.state.dd.insertion)
            : null}
        </ol>
      );
    }
  };

  renderMenusItem = (sortable, item) => {
    var menuId = sortable.props.root.id, // this is a little hacky way of getting the menu id
      itemPath = item.path,
      page = this.pagesMap[item.value.pageId],
      liClassName = "", // this is necessary for making fix, look for "Fix for :hover issue on Chrome" in Overlay.css
      itemClassName = "",
      iconClassName = "",
      handleMouseDown = null;

    // TODO: if this code is uncommented some wierd errors get thrown at drag & drop, figure it out later
    //if (
    //    (this.multiPageMode && page.type === pageTypes.anchor)
    //    || (!this.multiPageMode && page.type === pageTypes.internal)
    //) {
    //    return null;
    //}

    switch (item.type) {
      case "item":
        handleMouseDown = sortable.createMouseDownHandler(item);
        break;
      case "selection":
        break;
      case "insertion":
        liClassName = "brz-li brz-ed-placeholder-fix";
        itemClassName = "brz-ed-nav-placeholder";
        break;
      case "feedback":
        break;
    }

    if (!item.children.length) {
      if (page.type === pageTypes.internal) {
        iconClassName = page.index
          ? "brz-ed-icon-nav-page-home"
          : "brz-ed-icon-nav-page";
      } else if (page.type === pageTypes.anchor) {
        iconClassName = "brz-ed-icon-nav-page-external";
      } else {
        iconClassName = "brz-ed-icon-nav-page-external";
      }
    } else {
      iconClassName = "brz-ed-icon-nav-pages-group";
    }

    return (
      <li className={liClassName}>
        <div className="brz-ed-navigation-page-item-wrap">
          <div
            className={
              "brz-ed-large-popup-navigation-page-item " + itemClassName
            }
            onMouseDown={handleMouseDown}
          >
            <i
              className={
                "brz-ed-large-popup-navigation-page-item-icon " + iconClassName
              }
            />
            <span className="brz-span">{page.title}</span>
          </div>
          <i
            className="brz-ed-large-popup-navigation-item-remove"
            onClick={this.removeItemFromMenu.bind(null, menuId, itemPath)}
          />
        </div>
        {sortable.renderSubtree(item)}
      </li>
    );
  };

  renderPages = () => {
    return (
      <div className="brz-ed-large-popup-navigation-pages">
        <div className="brz-ed-large-popup-navigation-pages-inner">
          <h3 className="brz-h3">AVAILABLE {this.multiPageMode ? "PAGES" : "ANCHORS"}</h3>
          <Sortable
            ref={el => {
              this.pages = el;
            }}
            items={this.props.pages}
            renderContainer={this.renderPagesContainer}
            renderItem={this.renderPagesItem}
            onForwardMouseDown={this.pagesMouseDown}
            onChangeState={this.activateAutoScroll}
          />
          <AddNewPage onSubmit={this.props.onAddNewPage} />
        </div>
      </div>
    );
  };

  renderPagesContainer = (sortable, children) => {
    return (
      <ol className="brz-ol">
        {children}
        {sortable.getSelection()
          ? sortable.renderFeedback(sortable.getInsertion())
          : null}
      </ol>
    );
  };

  renderPagesItem = (sortable, item) => {
    var page = item.value,
      liClassName = "",
      iconClassName = "",
      handleMouseDown = null;

    if (!this.multiPageMode && page.type === pageTypes.internal) {
      return null;
    }

    switch (item.type) {
      case "item":
        handleMouseDown = sortable.createMouseDownHandler(item);
        break;
      case "selection":
        return null;
      case "insertion":
        liClassName = "brz-li placeholder";
        break;
      case "feedback":
        liClassName = "brz-li brz-ed-nav-feedback";
        break;
    }

    if (page.type === pageTypes.internal) {
      iconClassName = page.index
        ? "brz-ed-icon-nav-page-home"
        : "brz-ed-icon-nav-page";
    } else if (page.type === pageTypes.anchor) {
      iconClassName = "brz-ed-icon-nav-page-external";
    } else {
      iconClassName = "brz-ed-icon-nav-page-external";
    }

    if (page.dirty) {
      return (
        <li className="brz-li brz-ed-dirty-item">
          <div className="brz-ed-large-popup-navigation-page-item">
            <div className="brz-ed-large-popup-navigation-handler">
              <i className={iconClassName} />
              <span className="brz-span">{page.title}</span>
            </div>
            <div className="brz-ed-spinner-loader">Load</div>
          </div>
        </li>
      );
    } else {
      return (
        <li className={liClassName}>
          <div className="brz-ed-large-popup-navigation-page-item">
            <div
              className="brz-ed-large-popup-navigation-handler"
              onMouseDown={handleMouseDown}
            >
              <i className={iconClassName} />
              <span className="brz-span">{page.title}</span>
            </div>
            <div
              className="brz-ed-icon-cog brz-ed-large-popup-navigation-cog"
              onClick={this.openPageSettings.bind(null, page.id)}
            />
          </div>
        </li>
      );
    }
  };

  render() {
    var s = this.state,
      p = this.props,
      className = "brz-ed-large-popup-content";

    if (s.settings.show) {
      className += " brz-ed-large-popup-navigation-with-settings";
    }

    return (
      <div className="brz-ed-large-popup-scroll-wrap">
        <ScrollPane
          ref={el => {
            this.scrollpane = el;
          }}
          style={{ height: "100%" }}
          wrapScrollable={this.wrapScrollable}
        >
          <SizeMonitor onSizeChange={this.handleChangeSize}>
            <div className={className}>
              <div className="brz-ed-large-popup-navigation-wrap">
                {this.renderPages()}
                {this.renderMenus()}
              </div>
              <PageSettings
                page={s.settings.page}
                close={this.closePageSettings}
                onSave={p.onUpdatePage}
                onDelete={p.onDeletePage}
              />
            </div>
          </SizeMonitor>
        </ScrollPane>
      </div>
    );
  }
}

export default MenuBuilder;
