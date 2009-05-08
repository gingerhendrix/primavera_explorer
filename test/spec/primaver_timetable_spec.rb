require File.dirname(__FILE__) + '/spec_helper.rb'

describe "PrimaveraTimetable" do

  describe "parsing from web" do
    
    before(:each) do
      @pt = PrimaveraTimetable.new
      @doc = @pt.load_from_web
    end
    
    it "should retrieve an hpricot document" do
      @doc.should be_kind_of Hpricot::Doc
    end
    
    it "should populate entries" do
      @pt.entries.length.should be 145
    end
    
    it "should have correct first entry" do
      @pt.entries[0].name.should == "A Certain Ratio"
      @pt.entries[0].stage.should == "RAY BAN - VICE"
      @pt.entries[0].day.should == "Friday 29th of may"
      @pt.entries[0].time.should == "02:00"
    end
  end
  
  

end
