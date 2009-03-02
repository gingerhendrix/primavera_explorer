module Scrobbler2
  class Playlist < Base
    
    def initialize(playlist_url)
      @query = {:playlistURL => playlist_url}
    end
    
     get_resource :fetch, :root => 'playlist', :resource_name => 'playlist.fetch'
  end
end
