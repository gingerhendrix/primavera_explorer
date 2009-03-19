require File.dirname(__FILE__) + '/spec_helper.rb'


describe "Band" do

  describe "load_all" do
  
    it "should return an array of bands" do
      bands = Band.load_all
      bands.should be_kind_of(Array)
      bands.length.should == 87
    end
    
  end

end
