var _ = require('underscore'),
  React = require('react'),
  Model = require('visual/Model'),
  SelectControl = require('visual/component/controls/Select'),
  SelectControlItem = require('visual/component/controls/Select/SelectItem'),
  getPageById = require('visual/global/Pages').getPageById,
  getActivePageId = require('visual/global/Router').getActivePageId;

class Select extends React.Component {
  getCurrentPageBlocks = () => {
    var activePageId = getActivePageId(),
      page = getPageById(activePageId);

    if (page) {
      return page.data ? JSON.parse(page.data).container : [];
    } else {
      return [];
    }

  };

  renderOptions = () => {
    var currentPageBlocks = this.getCurrentPageBlocks(),
      blocksElements = _.map(currentPageBlocks, function (item) {
        var key = item.value.blockId,
          value = '#' + key,
          title = Model[item.type] ? Model[item.type].visual.title : 'Invalid Block';

        return (
          <SelectControlItem key={key} value={value}>
            {title}
          </SelectControlItem>
        );
      }, this);

    return [(
      <SelectControlItem key="not-selected">Not Selected</SelectControlItem>
    )].concat(blocksElements);
  };

  render() {
    return (
      <SelectControl defaultValue={this.props.value} onChange={this.props.onChange}>
        {this.renderOptions()}
      </SelectControl>
    );
  }
}

export default Select;
