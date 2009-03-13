
require 'rubygems'
require 'rake'
require 'rake_remote_task'

require 'lib/primavera_explorer.rb'

APP_NAME     = 'primavera_explorer'
APP_ROOT     = File.expand_path(File.dirname(__FILE__))
DEPLOY_ROOT  = "/var/web/apps/#{APP_NAME}"
APP_SERVER   = "gandrew.com"

role :app_server, APP_SERVER

Dir.glob(File.dirname(__FILE__) + "/tasks/*.rb") { |f|  require f }
