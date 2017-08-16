/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import VideoSurface from './Media';
import ControlBar from './ControlBar';

const styleSheet = createStyleSheet('Player', {
  root: {
    position: 'relative',
    marginTop: '-64px',
    height: '100vh'
  },
  hideCursor: {
    cursor: 'none'
  }
});

class Player extends Component {

  componentWillMount() {
    // Make the AppBar transparent and add a back button
    this.props.configureAppBar({
      secondary: 'Playing: No Title',
      transparent: true,
      hidden: !this.props.player.showUi,
      back: true
    });
  }

  componentDidMount() {
    this.handleHover();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.player.showUi !== this.props.player.showUi) {
      this.props.configureAppBar({
        hidden: !nextProps.player.showUi,
      });
    }
  }

  componentWillUnmount() {
    this.hoverTimeout && clearTimeout(this.hoverTimeout);

    // Well there is no other place in the application to exit fullscreen so lets force it here
    if (this.props.player.fullscreen) {
      this.toggleFullscreen();
    }
  }

  handleReady = () => {
    this.props.updateDuration(this.player.getDuration());
  }

  handleEnded = () => {
    this.props.togglePlay(false);
  }

  handleTimeUpdate = () => {
    this.props.updateCurrentTime(this.player.getCurrentTime());
  };

  handleTogglePlay = () => {
    this.props.togglePlay();
  }

  toggleFullscreen = () => {
    this.props.toggleFullscreen();
  }

  handleHover = debounce(() => {
    this.hoverTimeout && clearTimeout(this.hoverTimeout);

    this.props.toggleUi(true);
    this.hoverTimeout = setTimeout(() => {
      this.props.toggleUi(false);
    }, 5000);
  }, 400, {
    leading: true,
    trailing: false
  })

  ref = player => {
    this.player = player;
  }

  render() {
    const { classes, player } = this.props;
    const playerClassName = classNames(classes.root, {
      [classes.hideCursor]: !player.showUi
    });

    return (
      <div
        className={playerClassName}
        onMouseMove={this.handleHover}
      >
        <VideoSurface
          player={player}
          onEnded={this.handleEnded}
          onLoadedMetadata={(event, data) => { console.log(event, data); }}
          onReady={this.handleReady}
          onTimeUpdate={this.handleTimeUpdate}
          // {...props}
          // ref={this.ref}
          onRef={this.ref}
        />
        <ControlBar
          player={player}
          // hidden={!this.state.showUi}
          // playing={this.state.playing}
          // duration={this.state.duration}
          // fullscreen={this.state.fullscreen}
          onTogglePlay={this.handleTogglePlay}
          onToggleFullscreen={this.toggleFullscreen}
        />
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Player.propTypes = {
  classes: PropTypes.object.isRequired,
  configureAppBar: PropTypes.func.isRequired,
  // Player state
  player: PropTypes.object.isRequired,
  // Player actions
  togglePlay: PropTypes.func.isRequired,
  // setUrl: PropTypes.func.isRequired,
  // updateVolume: PropTypes.func.isRequired,
  // updatePlaybackRate: PropTypes.func.isRequired,
  updateDuration: PropTypes.func.isRequired,
  updateCurrentTime: PropTypes.func.isRequired,
  // updateTracks: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  toggleUi: PropTypes.func.isRequired

};
/* eslint-enable react/forbid-prop-types */

export default withStyles(styleSheet)(Player);
