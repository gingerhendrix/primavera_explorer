

class Band
  attr_accessor :name

  def initialize(yaml)
    @name = yaml[:name]
    @lastfm = yaml[:lastfm] || Hash.new
  end
  
  def lastfm_info(load=false)
    return @lastfm[:info] if @lastfm[:info] || !load
    puts "Retrieving artist info for " + @name + "\n"
    artist = Scrobbler2::Artist.new @name
    @lastfm[:info] = artist.info
  end
  
  def element_id
    "artist_" + name.gsub(/[^\w]/, "_")
  end
  
  def image
    if @lastfm[:info] && 
       @lastfm[:info]['image'] && 
       @lastfm[:info]['image'].length >= 3 && 
       @lastfm[:info]['image'][2]['#text'] 
      
      @lastfm[:info]['image'][2]['#text']
    else
      '#'
    end
  end
  
  def to_h
    {:id => element_id,
     :name => @name,
     :lastfm => @lastfm}
  end

  
  def self.load_all
    yaml = File.open( File.dirname(__FILE__) + '/../bands.yml' ) { |yf| YAML::load( yf ) }
    if(yaml)
      @bands = yaml.map {|b| Band.new b }
    else
      @bands = []
    end 
  end
    
  def self.save_all
    File.open( File.dirname(__FILE__) + '/../bands.yml', 'w' ) do |out|
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
  

end
