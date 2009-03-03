
namespace :update do

  desc "Update info from last.fm"  
  task :lastfm_info do
    bands = Band.load_all
    bands.each_index do |i|
      band = bands[i]
      puts "Updating band #{i} of #{bands.count} - #{band.name}"
      band.lastfm_info
    end
    Band.save_all
  end

end

