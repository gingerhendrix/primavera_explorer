
namespace :update do

  desc "Update info from last.fm"  
  task :lastfm_info do
    bands = Band.load_all
    bands.each_index do |i|
      band = bands[i]
      puts "Updating band #{i} of #{bands.count} - #{band.name}"
      band.lastfm_info(true)
      Band.save_all
      sleep(10)
    end
  end
  
  desc "Update tags from last.fm"
  task :lastfm_tags do
    bands = Band.load_all
    bands.each_index do |i|
      band = bands[i]
      if band.lastfm_tags.nil?
        puts "Updating band #{i} of #{bands.count} - #{band.name}\n"
        band.lastfm_tags(true)
        Band.save_all
        puts "Sleeping...\n"
        sleep(10)
      else
        puts "Skipping band #{i} of #{bands.count} - #{band.name}\n"
      end
    end
  end
  
  desc "Add a new band to the list"
  task :add, :name do |t, args|
    band = Band.add args.name.strip
    band.lastfm_info
    Band.save_all
  end
  
  desc "Add bands to the list from bandlist.txt"
  task :add_all do
    bandsTxt = File.read("bandlist.txt")
    bands = bandsTxt.split(',')
    bands.each do |band|
      band = Band.add band.strip
    end
    Band.save_all
  end
  
  desc "Update from primavera timetable" 
  task :timetable do
    db = Database.new(File.dirname(__FILE__) + "/../db");
    timetable = PrimaveraTimetable.new
    timetable.load_from_web
    timetable.save(db)
  end
  
  desc "Move from single file database to multi-file database"
  task :migrate_to_v2 do
    db = Database.new(File.dirname(__FILE__) + "/../db");
    yaml = File.open( File.dirname(__FILE__) + "/../bands.yml" ) { |yf| YAML::load( yf ) }
    yaml.each do |hash|
      b = Band.new_from_hash hash
      Band.add b
      b.lastfm_info.save(db)
      b.lastfm_tags.save(db)      
    end
    Band.save_all(db)  
  end

end

