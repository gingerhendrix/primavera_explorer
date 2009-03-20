
class Database

  def initialize(root)
    @root = root
  end

  def get_resource(name)
    yaml = File.open( "#{@root}/#{name}.yml" ) { |yf| YAML::load( yf ) } if File.exist? "#{@root}/#{name}.yml"
  end
  
  def save_resource(name, data)
    File.open( "#{@root}/#{name}.yml", 'w' ) do |out|
      YAML.dump data, out 
    end
  end

end
