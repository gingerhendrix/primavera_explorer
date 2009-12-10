require 'rubygems'
require 'active_support'
require 'sinatra'
require 'erb'
require 'lib/primavera_explorer.rb'

set :port, 4568

get '/' do
  db = Database.new File.dirname(__FILE__) + '/db'
  @bands = Band.load_all(db)
  #@timetable = PrimaveraTimetable.new
  #@timetable.load_from_db(db)
  #@bands = @timetable.bands
  haml :explorer
end

get '/bandsData.js' do
  db = Database.new File.dirname(__FILE__) + '/db'
  @bands = Band.load_all(db)
  #@timetable = PrimaveraTimetable.new
  #@timetable.load_from_db(db)
  #@bands = @timetable.bands
  "var bandsData = " + @bands.map(&:to_json).to_json + ";\n"
end


get '/ui.js' do
  def include_js(*filenames)
    filenames.map {|filename| IO.read(filename) }.join("\n")
  end
  @js_dir = File.dirname(__FILE__) + "/public/js";
  @template = ERB.new(IO.read(File.dirname(__FILE__) + '/views/js.erb'), nil, '%')
  @template.result(binding)
end
