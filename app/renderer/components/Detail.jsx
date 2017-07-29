import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStyleSheet, withStyles } from 'material-ui/styles';

const styleSheet = createStyleSheet('Detail', {
  root: {
    position: 'relative',
    marginTop: '-64px',
  },
  background: {
    height: '100vh',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    position: 'absolute',
    objectFit: 'cover',
    zIndex: 1
  },
  content: {
    height: '100vh',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    position: 'absolute',
    zIndex: 2
  },
  poster: {
    position: 'absolute',
    top: 90,
    bottom: 50,
    left: 110,
    boxShadow: '0 0 10px rgba(0,0,0,0.5)', // Use theme for this!
    borderRadius: 2,
    objectFit: 'cover',
    height: 'calc(100vh - 140px - 50px)',
    width: 'auto',
    maxHeight: '75vh'
  }
});

class Detail extends Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.fetchItem(id);

    // Make the AppBar transparent and add a back button
    this.props.configureAppBar({
      title: this.props.item.title,
      transparent: true,
      shadow: false,
      back: true
    });
  }

  render() {
    const { item, classes } = this.props;
    return (
      <div className={classes.root}>
        <img className={classes.background} src={item.background_image} alt={item.title} />
        <div className={classes.content}>
          <div className={classes.infoWrapper}>
            <img className={classes.poster} src={item.medium_cover_image} alt="Poster" />
            <div className={classes.metaContainer} />
          </div>
          {/*
            TODO: ->
            - Cover | Content
            - Controls container
          */}
        </div>
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Detail.propTypes = {
  item: PropTypes.object,
  match: PropTypes.object.isRequired,
  fetchItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  configureAppBar: PropTypes.func.isRequired
};
/* eslint-enable react/forbid-prop-types */

Detail.defaultProps = {
  item: {}
};

export default withStyles(styleSheet)(Detail);