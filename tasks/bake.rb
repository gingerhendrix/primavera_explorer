require 'haml'

namespace :bake do

  desc "Generate baked (static) version of site"
  task :all do
    Rake::Task['bake:html'].execute
    Rake::Task['bake:js'].execute
  end

  task :html do
    @bands = Band.load_all
    template = File.read(File.dirname(__FILE__) + '/../views/explorer.haml')

    template = Haml::Engine.new(template)
    out = template.render(binding)
    File.open(File.dirname(__FILE__) + '/../public/index.html', "w") { |io| io.write(out) }
  end
  
  task :js do
    @bands = Band.load_all
    File.open(File.dirname(__FILE__) + '/../public/bandsData.js', "w") { |io| 
      io.write("var bandsData = " + @bands.map(&:to_h).to_json + ";\n")
    }
  end


end
