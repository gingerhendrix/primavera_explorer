

class Band
  attr_accessor :name
  attr_accessor :lastfm_name
  attr_accessor :display_name
  attr_accessor :lastfm_info
  attr_accessor :lastfm_tags
  attr_accessor :timetable_entry
  
  @bands = []

  def initialize(name = false)
    if name 
      @name = name
      @lastfm_name = name
      @display_name = name
      @lastfm_info = LastfmInfo.new name
      @lastfm_tags = LastfmTags.new name
    end
      @timetable_entry = TimetableEntry.new name
  end
  
  def self.new_from_hash(info)
    band = Band.new
    name = info[:name]
    band.name = name
    band.lastfm_name = !info[:lastfm_name].blank? ? info[:lastfm_name] : name
    band.display_name = !info[:display_name].blank? ? info[:display_name] : name    
    if info[:lastfm]
      band.lastfm_info = LastfmInfo.new_from_hash band.lastfm_name, info[:lastfm][:info]
      band.lastfm_tags = LastfmTags.new_from_hash band.lastfm_name, info[:lastfm][:tags]    
    else
      band.lastfm_info = LastfmInfo.new band.lastfm_name
      band.lastfm_tags = LastfmTags.new band.lastfm_name
    end
    band
  end
  
  def element_id
    "artist_" + name.gsub(/[^\w]/, "_")
  end
  
  def to_h
    {:id => element_id,
     :name => @name,
     :display_name => @display_name,
     :lastfm_name => @lastfm_name,
     :lastfm => { :info => @lastfm_info.to_h, :tags => @lastfm_tags.to_h },
     :timetable => @timetable_entry ? @timetable_entry.to_h : nil }
  end
  
  def to_json
    {:id => element_id,
     :timetable => @timetable_entry ? @timetable_entry.to_json : nil ,
     :tags => @lastfm_tags.to_json,
     :info => @lastfm_info.to_json }
  end
  
  def to_db
    {:id => element_id,
     :name => @name,
     :display_name => @display_name,
     :lastfm_name => @lastfm_name}
  end

  def self.load_timetable(db)
    timetable = PrimaveraTimetable.new
    timetable.load_from_db db
  end
  
  def self.load_all(db)
    yaml = db.get_resource('bands')
    if(yaml)
      @bands = yaml.map do |b| 
        band = Band.new_from_hash b
        band.lastfm_info.load_from_db db
        band.lastfm_tags.load_from_db db
        band
      end
    else
      @bands = []
    end 
    return @bands
  end
    
  def self.save_all(db)
    db.save_resource('bands', @bands.map(&:to_db))
  end
  
  def self.find_by_name(name)
    band = @bands.find { |band| band.name == name }
    unless band
      band = Band.new(name)
      add band
   end
   band
  end

  def self.add(band)
     @bands << band
  end
  

end
