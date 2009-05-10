
class PrimaveraTimetable
  attr_accessor :entries
  
  def initialize
  
  end
  
  def load_from_web
    @doc = Hpricot(open("http://www.primaverasound.com/index.php?sec=horarios&idioma=en"))
    @entries = [];
    @doc.search('#horarios tr') do |el|
      if el.at("td.nom")
        name = el.at("td.nom a").inner_html.strip
        if el.at("td.escenari").inner_html.include? "<br />"
          names = [name, name]
          stages = el.at("td.escenari").inner_html.split("<br />")
          days = el.at("td.dia").inner_html.split("<br />")
          times = el.at("td.horari").inner_html.split("<br />")
          [0,1].each do |i|
            entry = TimetableEntry.new
            entry.name = names[i]
            entry.stage = stages[i]
            entry.day = days[i]
            entry.time = times[i]
            @entries << entry;
          end
        else
          entry = TimetableEntry.new
          entry.name = name
          entry.stage = el.at("td.escenari").inner_html
          entry.day = el.at("td.dia").inner_html
          entry.time = el.at("td.horari").inner_html
          @entries << entry;
        end
      end
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
    @entries.map(&:band)
  end
  
  def days
    days = []
    @entries.each do |entry|
      if !days.include? entry.day
        days.push entry.day
      end 
    end
    days.sort { |d1, d2| d1.match(/([\d]{2})/)[1] <=> d2.match(/([\d]{2})/)[1] rescue 0 }
  end
  
  def stages_for_day(day)
    entries = @entries.select do |entry|
      entry.day == day
    end  
    stages = []
    entries.each do |entry|
      if !stages.include? entry.stage
        stages.push entry.stage
      end
    end
    stages
  end
  
  def entries_for_day_and_stage(day, stage)
    entries = @entries.select do |entry|
      entry.day == day && entry.stage == stage
    end  
  end
  
  def bands_for_day_and_stage(day, stage)
    entries_for_day_and_stage(day, stage).map(&:band)    
  end
  
  def to_json_hash
     { :days => days.map { |day|
                   {:name => day, :stages => stages_for_day(day).map {  |stage|
                                      { :name => stage, :entries => entries_for_day_and_stage(day, stage).map(&:to_json_hash) }
                                   }
                   }
        }
      }
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
      entry.day = el.at("td.dia").inner_html.strip
      entry.time = el.at("td.horari").inner_html
      entry
    end
    
    def band
      band = Band.find_by_name(self.name) 
      #This is a bit dodgy - bands can have multiple timetable entries
      band.timetable_entry = self
      band
    end
    
    def self.new_from_hash(h)
      entry = TimetableEntry.new
      entry.name = h[:name]
      entry.stage = h[:stage]
      entry.day = h[:day]
      entry.time = h[:time]
      entry
    end
    
    def date
      begin 
        year = 2009
        month = "may"
        day = self.day.match(/([\d]{2})/)[1]
        time = self.time.match(/([\d]{2}):([\d]{2})/)
        hour = time[1].to_i
        min = time[2].to_i
        
        date = Time.mktime(year, month, day, hour, min)
        if hour >= 0 && hour <= 8
          date += 1.day
        end
        date
       rescue
       
       end
    end
    
    def element_id 
      "entry_#{day}_#{stage}_#{time}".gsub(/[^\w]/, "_")
    end
    
    def to_json_hash
      {:name => @name,
       :stage => @stage,
       :day => @day,
       :time => @time,
       :date => date ? date.ctime : "",
       :element_id => element_id}
    end
        
    def to_h
      {:name => @name,
       :stage => @stage,
       :day => @day,
       :time => @time,
       :date => date ? date.ctime : ""}
    end
    
    def to_json
      to_h
    end
    
  end

end

