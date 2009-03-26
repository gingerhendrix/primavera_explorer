
class LastfmInfo
  attr_accessor :name
  attr_accessor :info

  def initialize(name)
    @name = name
    @info = {}
  end

  def load_from_web
    artist = Scrobbler2::Artist.new @name
    @info = artist.info
  end
  
  def self.new_from_hash(name, hash)
    info = LastfmInfo.new(name)
    info.info = hash
    info
  end
  
  def to_h
    info
  end
  
  def to_json
    { :stats => (info ? info['stats'] : {}) }
  end
    
  def resource_name
    name = @name.gsub("/", "_")
    "lastfm_info/#{name}"
  end
  
  def save(db)
    db.save_resource(resource_name, info)
  end
  
  def load_from_db(db)
    @info = db.get_resource(resource_name)
  end
  
  
  def image
    if @info && @info['image'] &&  @info['image'].length >= 3 &&  @info['image'][2]['#text'] 
      @info['image'][2]['#text']
    else
      '#'
    end
  end

  def listeners
    @info['stats']['listeners'] if @info && @info['stats']
  end
  
  def playcount
    @info['stats']['playcount'] if @info && @info['stats']
  end
  
  def bio
    @info['bio']['summary'] if @info && @info['bio']
  end
end
