

require 'rubygems'
require 'sinatra'
require 'yaml'
require 'vendor/gems/scrobbler2/lib/scrobbler2.rb'

require 'lib/band.rb'
require 'lib/json.rb'

Scrobbler2::Base.api_key = "1b89604104e638437e5c992e898b43ab"
Scrobbler2::Base.api_secret = "943696955e27b45d7c91c978bed909d5"
Scrobbler2::Base.session_key = "d22c32a016d60adf5ea0b1d8a08e305f"


get '/' do
  @bands = Band.load_all
  haml :explorer
end


