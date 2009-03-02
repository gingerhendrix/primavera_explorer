

class Band
  attr_accessor :name

  def initialize(yaml)
    @name = yaml[:name]
  end
  
  def scrobbler_info
  
  end
  
  def self.load_all
    yaml = File.open( File.dirname(__FILE__) + '/../bands.yml' ) { |yf| YAML::load( yf ) }
    @@bands = yaml.map {|b| Band.new b }
  end
  
  def to_h
    {:name => @name}
  end
  
  def self.save_all
    File.open( File.dirname(__FILE__) + '/../bands.yml', 'w' ) do |out|
      YAML.dump @@bands.map(&:to_h), out 
    end
  end


end
