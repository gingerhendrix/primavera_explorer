
function Tracker(pageTracker){
  
  this.trackArtistSelect = function(artist_name){
    pageTracker._trackEvent("Artists", "Select", artist_name);
  }
}
