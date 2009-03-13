

require 'rubygems'
require 'sinatra'

require 'lib/primavera_explorer.rb'

set :port, 4568

get '/' do
  @bands = Band.load_all
  haml :explorer
end

get '/bandsData.js' do
  @bands = Band.load_all
  "var bandsData = " + @bands.map(&:to_h).to_json + ";\n"
end

