

require 'rubygems'
require 'sinatra'
require 'erb'
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

get '/timetable' do
  db = Database.new File.dirname(__FILE__) + '/db'
  Band.load_all(db)
  @timetable = PrimaveraTimetable.new
  @timetable.load_from_db(db)
  haml :timetable
end

get '/bandsData.js' do
  db = Database.new File.dirname(__FILE__) + '/db'
  Band.load_all(db)
  @timetable = PrimaveraTimetable.new
  @timetable.load_from_db(db)
  @bands = @timetable.bands
  "var bandsData = " + @bands.map(&:to_json).to_json + ";\n"
end

get '/timetableData.js' do
  db = Database.new File.dirname(__FILE__) + '/db'
  Band.load_all(db)
  @timetable = PrimaveraTimetable.new
  @timetable.load_from_db(db)
  "var timetableData = " + @timetable.to_json_hash.to_json + ";\n"
end

get '/timetable.js' do
  def include_js(*filenames)
      filenames.map {|filename| IO.read(filename) }.join("\n")
  end
  @js_dir = File.dirname(__FILE__) + "/public/js";
  @template = ERB.new(IO.read(File.dirname(__FILE__) + '/views/timetable.js.erb'), nil, '%')
  @template.result(binding)
end

get '/ui.js' do
  def include_js(*filenames)
    filenames.map {|filename| IO.read(filename) }.join("\n")
  end
  @js_dir = File.dirname(__FILE__) + "/public/js";
  @template = ERB.new(IO.read(File.dirname(__FILE__) + '/views/js.erb'), nil, '%')
  @template.result(binding)
end
