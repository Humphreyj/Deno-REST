import contains from "npm:@turf/boolean-contains";
import within from "npm:@turf/boolean-within";
import turfCentroid from "npm:@turf/centroid";
import landBbox from "npm:@turf/bbox";
import bboxPoly from "npm:@turf/bbox-polygon";
import center from "npm:@turf/center";

const parseFeatureCollection = (data) => {
  let filtered = data.features.filter((land) => land.geometry.coordinates);
  const keepouts = [];
  const projectLand = [];
  for (let land of filtered) {
    if (land.geometry.coordinates) {
      let newCoords = land.geometry.coordinates[0].map((coords) => {
        return [coords[0], coords[1]];
      });
      let outerFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [newCoords],
        },
        properties: {
          keepouts: [],
          outer: true,
        },
      };
      let sliced = land.geometry.coordinates.slice(1);

      for (let coords of sliced) {
        let newCoords = coords.map((coords) => {
          return [coords[0], coords[1]];
        });

        let feature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [newCoords],
          },
          properties: {},
        };
        if (contains(outerFeature, feature) || within(outerFeature, feature)) {
          // diff = difference.default(outerFeature, feature);
          keepouts.push(feature);
        }
      } //slice loop ends
      projectLand.push(outerFeature);
    }
  }
  let sitePolygon = getBoundingBox(projectLand);
  let result = {
    projectLand: projectLand,
    keepouts: keepouts,
    sitePolygon: sitePolygon,
  };
  return result;
};

const getOriginOfFeature = (feature) => {
  const origin = turfCentroid(feature);

  return origin.geometry.coordinates;
};

const addFeatureOrigins = (featureArray, isKeepout) => {
  let areaId = 1;

  featureArray.forEach((land) => {
    const origin = getOriginOfFeature(land);
    land.properties.origin = origin;
    if (!isKeepout) {
      land.properties.areaId = areaId;
      areaId++;
    }
  });
  return featureArray;
};

const getBoundingBox = (projectLand) => {
  let siteMinX = 9999999999;
  let siteMinY = 9999999999;
  let siteMaxX = 0;
  let siteMaxY = 0;

  for (let land of projectLand) {
    let bbox = landBbox(land);
    if (bbox[1] < siteMinX) {
      siteMinX = bbox[1];
    }
    if (bbox[0] < siteMinY) {
      siteMinY = bbox[0];
    }
    if (bbox[3] > siteMaxX) {
      siteMaxX = bbox[3];
    }
    if (bbox[2] > siteMaxY) {
      siteMaxY = bbox[2];
    }
  }
  let sitePoly = bboxPoly([siteMinY, siteMinX, siteMaxY, siteMaxX]);
  let centerPoint = center(sitePoly);

  sitePoly.properties.origin = centerPoint.geometry.coordinates;

  let result = {
    sitePoly: sitePoly,
  };

  return result;
};

export { parseFeatureCollection, addFeatureOrigins, getBoundingBox };
