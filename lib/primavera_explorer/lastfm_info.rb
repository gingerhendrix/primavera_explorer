
class LastfmInfo
  attr_accessor :name
  attr_accessor :info

  def initialize(name)
    @name = name
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
