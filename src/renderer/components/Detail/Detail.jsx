import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Typography,
  Button,
  Chip,
  LinearProgress,
  Input,
  FormControl,
  Select
} from 'material-ui';
import MenuItem from 'material-ui/Menu/MenuItem';
import { PlayArrow as PlayIcon } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';
import prettierBytes from 'prettier-bytes';


import DynamicImg from '../Util/DynamicImg';
import Rating from '../Util/Rating';

import { withView, View } from '../View';

import { capitalize } from '../../utils/stringUtil';


const styleSheet = theme => ({
  wrapper: {
    position: 'relative',
    marginTop: -64 - 29
  },
  header: {
    position: 'relative',
    width: '100vw',
    height: '40vh',
    transition: theme.transitions.create('height', { duration: 1300 }),
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(0, 0, 0, 0.2)'
    }
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    zIndex: 0
  },
  meta: {
    position: 'absolute',
    bottom: 5,
    display: 'flex',
    alignItems: 'center',
    zIndex: 3,
    transition: theme.transitions.create('opacity', { duration: 1300 })
  },
  content: theme.mixins.gutters({
    position: 'relative',
    top: 0,
    height: '100vh',
    width: '100%',
    display: 'block',
    paddingTop: 24,
    right: 0,
    background: theme.palette.background.default,
    zIndex: 2,
    transition: theme.transitions.create('all', { duration: 1300 }),
    boxShadow: '0px -7px 8px -4px rgba(0, 0, 0, 0.2), 0px -12px 17px 2px rgba(0, 0, 0, 0.14), 0px -5px 22px 4px rgba(0, 0, 0, 0.12)',
  }),
  playButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: -28,
    marginRight: 24,
    zIndex: 3,
  },
  info: {
    paddingTop: 24
  },
  metaHeaderDot: {
    position: 'relative',
    backgroundColor: '#ffffff',
    margin: '0 16px',
    width: 7,
    height: 7,
    borderRadius: '50%'
  },
  row: {
    display: 'inline-flex',
    flexWrap: 'wrap'
  },
  chip: {
    marginLeft: 4,
    marginRight: 4
  },

  downloading: {
    // See: https://github.com/cssinjs/jss-nested
    '& $header': {
      height: '100vh',
      '& $meta': {
        opacity: 0
      }
    },
    '& $content': {
      opacity: 0,
      zIndex: 0
    }
  },

  middleWrapper: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    position: 'relative'
  },

  qualityButton: {
    position: 'absolute',
    top: 0,
    right: 100,
    padding: 8,
    borderRadius: 2,
    marginTop: -26,
    marginRight: 24,
    zIndex: 3,
    background: theme.palette.background.default
  }
});

class Detail extends Component {
  state = {
    preparing: false,
    downloading: false,
    torrent: null,
    quality: '720'
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.fetchItem(id);

    this.context.setStatusBarConfig({
      transparent: true
    });
    this.context.setAppBarConfig({
      title: this.props.item.title,
      transparent: true,
      back: true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item && nextProps.item.torrents) {
      const highestQuality = Object.keys(nextProps.item.torrents)[0];
      this.setState({ torrent: nextProps.item.torrents[highestQuality] });
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
    ipc.send('stream:stop');
  }

  handleQualityChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // componentWillReceiveProps(nextProps) {
  //   // TODO: Add a button to select quality.

  //   if (nextProps.item && nextProps.item.torrents) {
  //     console.log(nextProps.item);
  //     const highestQuality = Object.keys(nextProps.item.torrents)[0];
  //     this.setState({ torrent: nextProps.item.torrents[highestQuality] });
  //   }

  //   if (nextProps.loading !== this.state.loading) {
  //     this.setState({ loading: nextProps.loading });
  //   }
  // }

  playItem() {
    // this.props.playTorrent(this.state.torrent.hash);
    this.setState({ downloading: true });
    ipc.send('stream:start', this.state.torrent.hash);
  }

  renderMeta() {
    const { classes, item } = this.props;

    return (
      <div className={classes.meta}>
        <Rating
          rating={item.rating.percentage / 10}
          title={item.rating.percentage}
        />
        <span className={classes.metaHeaderDot} />
        <div className={classes.row}>
          {item.genres && item.genres.map(genre => (
            <Chip
              label={capitalize(genre)}
              key={genre}
              className={classes.chip}
            />
          ))}
        </div>
        <span className={classes.metaHeaderDot} />
        <Typography>{item.year}</Typography>
        <span className={classes.metaHeaderDot} />
        <Typography>{item.runtime} min</Typography>
      </div>
    );
  }

  renderContent() {
    const { classes, item } = this.props;

    return (
      <div className={classes.content}>
        <FormControl className={classes.qualityButton}>
          <Select value={this.state.quality} onChange={this.handleQualityChange} input={<Input name="quality" id="quality-select" />}>
            <MenuItem value="720">720p</MenuItem>
            <MenuItem value="1080">1080p</MenuItem>
          </Select>
        </FormControl>

        <Button fab color="primary" className={classes.playButton} onClick={() => this.playItem()}>
          <PlayIcon />
        </Button>
        <Typography type="headline">{item.title}</Typography>
        <div className={classes.info}>
          <Typography>{item.synopsis}</Typography>
        </div>
      </div>
    );
  }

  renderProgress() {
    const { classes, streamer: { torrent } } = this.props;

    return (
      <div className={classes.middleWrapper}>
        <div style={{ width: '100%' }}>
          <LinearProgress style={{ width: '100%' }} />
          {torrent && (
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
              <span>Download Speed: {prettierBytes(torrent.downloadSpeed || 0)}</span>
              <span>Upload Speed: {prettierBytes(torrent.uploadSpeed || 0)}</span>
              <span>Peers: {torrent.peers || 0}</span>
            </div>)}
        </div>
      </div>
    );
  }

  render() {
    const { loading, item, classes } = this.props;

    const wrapperClassName = classNames(classes.wrapper, {
      [classes.downloading]: this.state.downloading
    });

    if (!loading) {
      return (
        <div className={wrapperClassName}>
          <div className={classes.header}>
            <DynamicImg
              className={classes.background}
              src={item.images.background}
              alt={item.title}
            />

            {this.state.downloading && this.renderProgress()}

            {this.renderMeta()}
          </div>

          {this.renderContent()}
        </div>
      );
    }

    return null;
  }
}

/* eslint-disable react/forbid-prop-types */
Detail.propTypes = {
  loading: PropTypes.bool,
  item: PropTypes.object,
  streamer: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  fetchItem: PropTypes.func.isRequired,
  // playTorrent: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,

  onUnload: PropTypes.func.isRequired
};
/* eslint-enable react/forbid-prop-types */

Detail.defaultProps = {
  loading: true,
  item: {}
};

Detail.contextTypes = {
  ...View.childContextTypes
};

export default withView(withStyles(styleSheet)(Detail));
