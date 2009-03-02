require 'rubygems'
require 'httparty'
require 'active_support'
$: << File.dirname(__FILE__)

module Scrobbler2

end

require 'scrobbler2/base.rb'
require 'scrobbler2/auth.rb'
require 'scrobbler2/album.rb'
require 'scrobbler2/artist.rb'
require 'scrobbler2/event.rb'
require 'scrobbler2/group.rb'
require 'scrobbler2/library.rb'
require 'scrobbler2/playlist.rb'
require 'scrobbler2/tag.rb'
require 'scrobbler2/user.rb'


