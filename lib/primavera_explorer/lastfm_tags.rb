
class LastfmTags
  attr_accessor :name
  attr_accessor :tags

  def initialize(name)
    @name = name
  end

  def load_from_web
    artist = Scrobbler2::Artist.new @name
    @tags = artist.top_tags || @tags
  end
  
  def top_tags
    if has_tags?
      tags = @tags['tag']
      sorted_tags = tags.sort_by { |tag| tag['count'].to_i }
      tags.slice(0, 5)
    else
      []
    end
  end
  
  def has_tags?
    @tags && @tags['tag'] && @tags['tag'].is_a?(Array)
  end
  
  def nonzero_tags
    if has_tags?
      return {'tag' => @tags['tag'].select { |tag| tag['count'].to_i > 0 } }
    end
  end
  
  def resource_name
    name = @name.gsub("/", "_");
    "lastfm_tags/#{name}"
  end
  
  def save(db)
    db.save_resource(resource_name, @tags)
  end
  
  def load_from_db(db)
    @tags = db.get_resource(resource_name) || @tags
  end
  
  def self.new_from_hash(name, hash)
    tags = LastfmTags.new(name)
    tags.tags = hash
    tags
  end
  
  def to_h
    tags
  end

  def to_json
    nonzero_tags
  end

end
