import React from 'react';

import turfInside from 'turf-inside';

import Map from 'containers/Map';

import styles from './styles.css';

export class HoverMap extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.decade !== this.props.decade) {
      if (this.groupedDataLayer) {
        this.groupedDataLayer.clearLayers();
        if (nextProps.groupedGeoJSON) {
          this.groupedDataLayer.addData(nextProps.groupedGeoJSON);
        }
      }

      if (this.allDataLayer) {
        this.allDataLayer.clearLayers();
      }
    }
  }

  render() {
    return (
      <Map mapCreated={this.mapCreated.bind(this)} options={this.props.options.map} />
    );
  }

  mapMoving = false;

  mapCreated(map) {
    var options = this.props.options.tileLayer;

    L.tileLayer(options.tileUrl, options).addTo(map);

    this.groupedDataLayer = L.geoJson(this.props.groupedGeoJSON, {
      style: this.props.options.geojson,
      onEachFeature: this.props.onEachFeatureGrouped
    }).addTo(map);

    this.allDataLayer = L.geoJson(null, {
      style: () => this.selectedStyleForZoom(map.getZoom()),
      onEachFeature: this.props.onEachFeatureAll
    }).addTo(map);

    map.on('movestart', () => this.mapMoving = true);
    map.on('moveend',  () => this.mapMoving = false);
    map.on('zoomend', this.zoomEnd.bind(this));

    map.on('mousemove', this.throttle((event) => {
      if (this.mapMoving || this.props.disableHover) {
        return;
      }

      this.highlightMaps(event.latlng, (hoveredMaps) => {

        this.allDataLayer.clearLayers();
        if (hoveredMaps.length) {
        	this.allDataLayer.addData(hoveredMaps);
        }

        if (this.props.onHoverMaps) {
          this.props.onHoverMaps(hoveredMaps)
        }
      })
    }, 50));

    if (this.props.mapCreated) {
      this.props.mapCreated(map);
    }

    this.lastZoom = map.getZoom();
    this.map = map;
  }

  // From: https://remysharp.com/2010/07/21/throttling-function-calls
  throttle(fn, threshhold = 250, scope) {
    var last;
    var deferTimer;

    return function () {
      var context = scope || this;

      var now = +new Date;
      var args = arguments;

      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  zoomThreshold = 16;

  selectedStyleForZoom(zoom) {
    var style = Object.assign({}, this.props.options.geojsonSelected);
    if (zoom >= this.zoomThreshold) {
      style.fillOpacity = 0;
    }
    return style;
  }

  zoomEnd() {
    const zoom = this.map.getZoom();
    if ((this.lastZoom < this.zoomThreshold && zoom >= this.zoomThreshold) ||
      (this.lastZoom >= this.zoomThreshold && zoom < this.zoomThreshold)) {
      this.allDataLayer.setStyle(this.selectedStyleForZoom(zoom));
    }
    this.lastZoom = zoom;
  }

  highlightMaps(latlng, callback) {
    if (!this.props.tree) {
      callback([]);
      return;
    }

  	var results = this.props.tree.search({
			minX: latlng.lng,
			minY: latlng.lat,
			maxX: latlng.lng,
			maxY: latlng.lat
		});

  	if (results.length) {
      var hoveredMaps = results.map((result) => this.props.allGeoJSON.features[result.index])
  			.filter((feature) => {
          const point = {
  					type: 'Feature',
  					geometry: {
  						type: 'Point',
  						coordinates: [
  							latlng.lng,
  							latlng.lat
  						]
  					}
          };
          return turfInside(point, feature)
        });

      callback(hoveredMaps)
		} else {
			callback([])
		}
	}
}

export default HoverMap;
