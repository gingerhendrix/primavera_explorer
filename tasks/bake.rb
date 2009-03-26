require 'haml'
require 'erb'

namespace :bake do

  desc "Generate baked (static) version of site"
  task :all do
    Rake::Task['bake:html'].execute
    Rake::Task['bake:data_js'].execute
    Rake::Task['bake:ui_js'].execute
  end

  task :html do
    db = Database.new File.dirname(__FILE__) + '/../db'
    Band.load_all(db)
    @timetable = PrimaveraTimetable.new
    @timetable.load_from_db(db)
    @bands = @timetable.bands

    template = File.read(File.dirname(__FILE__) + '/../views/explorer.haml')

    template = Haml::Engine.new(template)
    out = template.render(binding)
    File.open(File.dirname(__FILE__) + '/../public/index.html', "w") { |io| io.write(out) }
  end
  
  task :data_js do
    db = Database.new File.dirname(__FILE__) + '/../db'
    Band.load_all(db)
    @timetable = PrimaveraTimetable.new
    @timetable.load_from_db(db)
    @bands = @timetable.bands 
    
    File.open(File.dirname(__FILE__) + '/../public/bandsData.js', "w") { |io| 
      io.write("var bandsData = " + @bands.map(&:to_json).to_json + ";\n")
    }
  end
  
  task :ui_js do
    def include_js(*filenames)
      filenames.map {|filename| IO.read(filename) }.join("\n")
    end
    @js_dir = File.dirname(__FILE__) + "/../public/js";
    @template = ERB.new(IO.read(File.dirname(__FILE__) + '/../views/js.erb'), nil, '%')
    File.open(File.dirname(__FILE__) + '/../public/ui.js', "w") do |io| 
      io.write(@template.result(binding))
    end
  end
  
  desc "Clear baked version of site" 
  task :clear do
    rm File.dirname(__FILE__) + '/../public/index.html'
    rm File.dirname(__FILE__) + '/../public/bandsData.js'
    rm File.dirname(__FILE__) + '/../public/ui.js'
  end


end
