

class Band
  attr_accessor :name
  attr_accessor :lastfm_info
  attr_accessor :lastfm_tags
  
  cattr_accessor :database

  def initialize
  end
  
  def self.new_from_hash(info)
    band = Band.new
    name = info[:name]
    band.name = name
    band.lastfm_info = LastfmInfo.new_from_hash name, info[:lastfm][:info]
    band.lastfm_tags = LastfmTags.new_from_hash name, info[:lastfm][:tags]    
    band
  end
  
  def element_id
    "artist_" + name.gsub(/[^\w]/, "_")
  end
  
  def to_h
    {:id => element_id,
     :name => @name,
     :lastfm => { :info => @lastfm_info.to_h, :tags => @lastfm_tags.to_h } }
  end

  
  def self.load_all
    yaml = File.open( database ) { |yf| YAML::load( yf ) }
    if(yaml)
      @bands = yaml.map {|b| Band.new_from_hash b }
    else
      @bands = []
    end 
  end
    
  def self.save_all
    File.open( database, 'w' ) do |out|
      YAML.dump @bands.map(&:to_h), out 
    end
  end
  
  def self.find_by_name(name)
    self.load_all if !@bands
    @bands.find { |band| band.name == name }
  end

  def self.add(name)
     band = Band.find_by_name(name)
     if !band
        band = Band.new :name => name
        @bands << band
     end
     band
  end
  
  def self.update_timetable
    
  end
  

end
