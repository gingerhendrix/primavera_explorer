

require 'rubygems'
require 'sinatra'
require 'yaml'

require 'lib/band.rb'

get '/' do
  @bands = Band.load_all
  haml :explorer
end
