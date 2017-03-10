Vagrant.configure("2") do |config|
  # box
  config.vm.box = "ubuntu/xenial64"

  # networking
  config.vm.network "private_network", ip: "192.168.50.200"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.hostname = "webdevbootcamp.dev"
  config.hostsupdater.remove_on_suspend = true

  # sharing
  config.vm.synced_folder ".", "/app"

  # provisioning

  config.vm.provision "shell", inline: <<-SHELL
   apt-get update
   apt-get install -y node
   apt-get install git
   curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
   apt-get install -y nodejs
   sudo apt-get install -y mongodb
  SHELL
end
