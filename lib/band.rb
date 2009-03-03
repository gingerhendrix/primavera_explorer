

class Band
  attr_accessor :name

  def initialize(yaml)
    @name = yaml[:name]
    @lastfm = yaml[:lastfm] || Hash.new
  end
  
  def lastfm_info
    return @lastfm[:info] if @lastfm[:info]
    artist = Scrobbler2::Artist.new @name
    @lastfm[:info] = artist.info
  end
  
  def self.load_all
    yaml = File.open( File.dirname(__FILE__) + '/../bands.yml' ) { |yf| YAML::load( yf ) }
    @@bands = yaml.map {|b| Band.new b }
  end
  
  def to_h
    {:name => @name,
     :lastfm => @lastfm}
  end
  
  def self.save_all
    File.open( File.dirname(__FILE__) + '/../bands.yml', 'w' ) do |out|
      YAML.dump @@bands.map(&:to_h), out 
    end
  end


end
