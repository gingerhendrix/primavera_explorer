
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

end

