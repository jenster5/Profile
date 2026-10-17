 # Project conventions

- LabRoom station buttons request navigation through LabGame; LabCharacter invokes station interaction only after arrival, so taps preserve walking and share keyboard popup/progress tracking. Convert sprite positions to collision-box origins when calling pathfinding to keep routes clear of obstacles.
- MobileStationPanel portals all four station panels to the document body on phone-sized screens and exports their shared size and position, avoiding room transforms and keeping viewport-sized popups readable while retaining room-relative tablet/desktop animations.