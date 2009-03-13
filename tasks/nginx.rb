namespace :nginx do

  desc "Install nginx conf"
  remote_task :deploy  do
    run "sudo cp -r -f #{DEPLOY_ROOT}/current/config/production/#{APP_NAME}.nginx.conf /etc/nginx/sites-available"
    run "sudo ln -s -f /etc/nginx/sites-available/#{APP_NAME}.nginx.conf /etc/nginx/sites-enabled"
  end
  
  desc "Restart nginx"
  remote_task :restart do
    run "sudo /etc/init.d/nginx restart"
  end 

end
