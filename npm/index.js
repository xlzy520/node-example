const npmUserPackagesDownloads = require('npm-user-packages-downloads')
npmUserPackagesDownloads('zhibi', '2019-09-07:2021-08-07')
  .then((data) => console.log(data))
