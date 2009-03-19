

require 'rubygems'
require 'sinatra'

require 'lib/primavera_explorer.rb'

set :port, 4568

get '/' do
  db = Database.new File.dirname(__FILE__) + '/db'
  @bands = Band.load_all(db)
  haml :explorer
end

get '/bandsData.js' do
  db = Database.new File.dirname(__FILE__) + '/db'
  @bands = Band.load_all(db)
  "var bandsData = " + @bands.map(&:to_h).to_json + ";\n"
end

