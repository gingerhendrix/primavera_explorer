
def archive
  commit = `git-rev-list --max-count=1 --abbrev=10 --abbrev-commit HEAD`.chomp
  file = "#{APP_NAME}-#{commit}.tar.gz"
end

namespace :deploy do
    task :build do
      sh "git archive --format=tar HEAD | gzip > #{archive}"
    end

    remote_task :push => :build do
      rsync archive, "/tmp"
    end

    desc "Install a release from the latest commit"
    remote_task :install => :push do
      date_stamp = Time.now.strftime("%Y%m%d")
      last_release = run("ls #{DEPLOY_ROOT}/rels | sort -r | head -n 1").chomp

      if last_release =~ /#{date_stamp}\-(\d+)/
        serial = $1.to_i + 1
      else
        serial = 0 
      end

      rel = ("%d-%02d" % [date_stamp, serial])
      rel_dir = "#{DEPLOY_ROOT}/rels/#{rel}"

      run "sudo mkdir -p #{rel_dir}"
      run "sudo tar -xzvf /tmp/#{archive} -C #{rel_dir} && rm -rf /tmp/#{archive}"
      run "sudo ln -s -f -T #{rel_dir} #{DEPLOY_ROOT}/current"
    end
end    
