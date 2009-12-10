class TimetableEntry
  attr_accessor :name
  attr_accessor :stage
  attr_accessor :day
  attr_accessor :time

  def initialize(name = '')
    @name = name
  end

  def self.new_from_element(el)
    entry = TimetableEntry.new
    entry.name = el.at("td.nom a").inner_html.strip
    entry.stage = el.at("td.escenari").inner_html
    entry.day = el.at("td.dia").inner_html
    entry.time = el.at("td.horari").inner_html
    entry
  end
  
  def self.new_from_hash(h)
    entry = TimetableEntry.new
    entry.name = h[:name]
    entry.stage = h[:stage]
    entry.day = h[:day]
    entry.time = h[:time]
    entry
  end
  
  def to_h
    {:name => @name,
     :stage => @stage,
     :day => @day,
     :time => @time}
  end
  
  def to_json
    to_h
  end
  
end