import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  List,
  ListSubheader,
  Toolbar,
  Drawer,
  Divider,
  Typography
} from 'material-ui';

import { withStyles } from 'material-ui/styles';
import ViewDrawerNavItem from './ViewDrawerNavItem';

const styleSheet = theme => ({
  paper: {
    width: 250,
    backgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }
});

class ViewDrawer extends Component {
  renderItems(items) {
    const { onRequestClose } = this.props;

    return items.map(item => (
      <ViewDrawerNavItem
        {...item}
        onClick={onRequestClose}
      />
    ));
  }

  renderCategories(categories) {
    return categories.map(category => (
      <List subheader={<ListSubheader>{category.title}</ListSubheader>}>
        {this.renderItems(category.items)}
      </List>
    ));
  }

  render() {
    const { classes, title, items, categories, open, onRequestClose } = this.props;

    return (
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onRequestClose={onRequestClose}
        keepMounted={false}
      >
        <div className={classes.nav}>
          <Toolbar className={classes.toolbar}>
            <Typography type="title" color="inherit">
              {title}
            </Typography>
            <Divider absolute />
          </Toolbar>

          <List disablePadding>
            {this.renderItems(items)}

            <Divider />

            {this.renderCategories(categories)}
          </List>
        </div>
      </Drawer>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
ViewDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func,
  open: PropTypes.bool,
};
/* eslint-enable react/forbid-prop-types */

ViewDrawer.defaultProps = {
  open: false,
  onRequestClose: () => {}
};

export default withStyles(styleSheet)(ViewDrawer);