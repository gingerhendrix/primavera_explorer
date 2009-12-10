
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
      band = Band.find_by_name(entry.name) 
      band.timetable_entry = entry
      band
    end
    @bands
  end
  

end

