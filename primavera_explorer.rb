

require 'rubygems'
require 'sinatra'

get '/' do
  @bands = File.open( File.dirname(__FILE__) + '/bands.yml' ) { |yf| YAML::load( yf ) }
  haml :explorer
end
