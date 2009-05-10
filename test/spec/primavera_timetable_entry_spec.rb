require File.dirname(__FILE__) + '/spec_helper.rb'

describe "PrimaveraTimetableEntry" do

  describe "date" do
    
    it "should correctly parse day and time" do
      entry = PrimaveraTimetable::TimetableEntry.new
      entry.day = "Friday 29th of may"
      entry.time = "22:00"
      entry.date.should == Time.mktime(2009, 05, 29, 22, 00)
    end    
    
    it "should wraparound for hours after midnight" do
      entry = PrimaveraTimetable::TimetableEntry.new
      entry.day = "Friday 29th of may"
      entry.time = "01:00"
      entry.date.should == Time.mktime(2009, 05, 30, 01, 00)
    end  
    
    it "should wraparound month if necessary" do
      entry = PrimaveraTimetable::TimetableEntry.new
      entry.day = "Sunday 31st of may"
      entry.time = "01:00"
      entry.date.should == Time.mktime(2009, 06, 01, 01, 00)
    end   
  
  end


end
