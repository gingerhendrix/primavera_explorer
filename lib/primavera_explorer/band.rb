

class Band
  attr_accessor :name
  attr_accessor :lastfm_info
  attr_accessor :lastfm_tags
  
  @bands = []

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
  
  def to_db
    {:id => element_id,
     :name => @name }
  end

  
  def self.load_all(db)
    yaml = db.get_resource('bands')
    if(yaml)
      @bands = yaml.map {|b| Band.new_from_hash b }
    else
      @bands = []
    end 
  end
    
  def self.save_all(db)
    db.save_resource('bands', @bands.map(&:to_db))
  end
  
  def self.find_by_name(name)
    @bands.find { |band| band.name == name }
  end

  def self.add(band)
     @bands << band
  end
  

end
