

require 'rubygems'
require 'sinatra'

require 'lib/primavera_explorer.rb'

set :port, 4568

get '/' do
  db = Database.new File.dirname(__FILE__) + '/db'
  Band.load_all(db)
  @timetable = PrimaveraTimetable.new
  @timetable.load_from_db(db)
  @bands = @timetable.bands
  haml :explorer
end

get '/bandsData.js' do
  db = Database.new File.dirname(__FILE__) + '/db'
  Band.load_all(db)
  @timetable = PrimaveraTimetable.new
  @timetable.load_from_db(db)
  @bands = @timetable.bands
  "var bandsData = " + @bands.map(&:to_json).to_json + ";\n"
end

