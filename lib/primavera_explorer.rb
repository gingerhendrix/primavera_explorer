
$: << File.dirname(__FILE__)

require 'rubygems'
require 'yaml'
require 'hpricot'
require 'open-uri'

require 'vendor/gems/scrobbler2/lib/scrobbler2.rb'

Scrobbler2::Base.api_key = "1b89604104e638437e5c992e898b43ab"
Scrobbler2::Base.api_secret = "943696955e27b45d7c91c978bed909d5"
Scrobbler2::Base.session_key = "d22c32a016d60adf5ea0b1d8a08e305f"

require 'primavera_explorer/database.rb'
require 'primavera_explorer/band.rb'
require 'primavera_explorer/lastfm_info.rb'
require 'primavera_explorer/lastfm_tags.rb'
require 'primavera_explorer/primavera_timetable.rb'
require 'primavera_explorer/json.rb'




