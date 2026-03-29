// Centralized image references for the app.
// All paths are relative to src/utils/.

export const Images = {
  // Backgrounds & scenes
  gameLogo: require('../../images/game_logo.png'),
  introductionBackground: require('../../images/Introduction_Background.png'),
  fragmentBackground: require('../../images/Fragment_Background.png'),
  skySnatchers: require('../../images/The Sky Snatchers.png'),

  // Characters
  theKeeper: require('../../images/character_the_keeper.png'),
  theGriffin: require('../../images/The Griffin.png'),
  mythicUrbanGriffin: require('../../images/mythic_the_urban_griffin.png'),

  // Grand Central scenes (also duplicated in assets/ for legacy screens)
  grandCentralExterior: require('../../images/Grand Central_Exterior.png'),
  grandCentralConcourse: require('../../images/Grand Central_Concourse.png'),
  grandCentralWhisperingGallery: require('../../images/Grand Central_WhisperingGallery.png'),

  // Game items
  token: require('../../images/Token.png'),
  magicalKey: require('../../images/Magical Key.png'),
  mapMarker: require('../../images/Map Marker.png'),

  // Landmark thumbnails — keyed by landmarkId
  landmarkThumbnails: {
    1: require('../../images/landmark_grand_central_terminal.png'),
    // Placeholder IDs for future landmarks (update when IDs are confirmed)
    brooklynBridge: require('../../images/landmark_brooklyn_bridge.png'),
    flatironBuilding: require('../../images/landmark_flatiron_building.png'),
    freedomTower: require('../../images/landmark_freedom_tower_&_oculus.png'),
    theUnisphere: require('../../images/landmark_the_unisphere.png'),
  } as Record<string | number, any>,

  // Puzzle fragment images
  puzzleImages: {
    coneyIslandCyclone: require('../../images/puzzle_coney_island_cyclone_fragment.png'),
    theUnisphere: require('../../images/puzzle_the_unisphere_fragment.png'),
  },
};
