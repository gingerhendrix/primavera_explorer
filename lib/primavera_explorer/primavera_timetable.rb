
class PrimaveraTimetable
  attr_accessor :entries
  
  def initialize
  
  end
  
  def load_from_web
    @doc = Hpricot(open("http://www.primaverasound.com/index.php?sec=horarios&idioma=en"))
    @entries = [];
    @doc.search('#horarios tr') do |el|
      @entries << TimetableEntry.new_from_element(el);
    end
    @doc
  end

  def load_from_db(db)
    @entries = db.get_resource("primavera_timetable")[:entries].map {|e| TimetableEntry.new_from_hash(e) }
  end
  
  def save(db)
    db.save_resource("primavera_timetable", self.to_db);
  end
  
  def to_db
    {:entries => @entries.map(&:to_h)}
  end
  
  def bands
    @bands = @entries.map do |entry|
      band = Band.find_by_name(entry.name) || Band.new(entry.name)
      band.timetable_entry = entry
      band
    end
    @bands
  end
  
  class TimetableEntry
    attr_accessor :name
    attr_accessor :stage
    attr_accessor :day
    attr_accessor :time
  
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
    
  end

end

