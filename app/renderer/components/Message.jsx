import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'material-ui';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';

const styleSheet = createStyleSheet('Message', theme => ({
  anchorTopLeft: {
    top: (theme.spacing.unit * 3) + 64
  },
  anchorTopCenter: {
    top: (theme.spacing.unit * 3) + 64
  },
  anchorTopRight: {
    top: (theme.spacing.unit * 3) + 64
  }
}));

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgOpen: props.open,
      open: props.open
    };
  }

  // TODO: Make this a bit less messy xD
  // for example with componentWillUpdate
  // or componentShouldUpdate
  componentWillReceiveProps({ open }) {
    if (this.state.orgOpen !== open) {
      this.setState({ orgOpen: open });
    }
    if (this.state.open !== open && this.state.orgOpen !== open) {
      console.log(this.state.open !== open && this.state.orgOpen !== open);
      this.setState({ open });
    }
  }

  onRequestClose(event, reason) {
    if (reason === 'clickaway') return;

    this.setState({ open: false });
  }

  render() {
    const { classes: {
    anchorTopLeft,
    anchorTopCenter,
    anchorTopRight }, message, action, position, duration, onRequestClose } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: position.vertical,
          horizontal: position.horizontal,
        }}
        classes={{
          anchorTopLeft,
          anchorTopCenter,
          anchorTopRight
        }}
        open={this.state.open}
        onRequestClose={onRequestClose || this.onRequestClose.bind(this)}
        autoHideDuration={duration}
        transition={<Slide direction={position.direction} />}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
        action={action}
      />
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Message.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  message: PropTypes.string.isRequired,
  action: PropTypes.array,
  duration: PropTypes.number,
  position: PropTypes.object,
  onRequestClose: PropTypes.func
};
/* eslint-enable react/forbid-prop-types */

Message.defaultProps = {
  open: false,
  action: [],
  duration: null,
  position: {
    vertical: 'top',
    horizontal: 'right',
    direction: 'left'
  },
  onRequestClose: undefined
};

export default withStyles(styleSheet)(Message);
