%windir%\System32\inetsrv\appcmd stop apppool /apppool.name:C1-Testing.Servicio.NeoCore
%windir%\System32\inetsrv\appcmd stop site /site.name:C1-Testing.Servicio.NeoCore
%windir%\System32\inetsrv\appcmd stop apppool /apppool.name:C2-Testing.Servicio.CPFinancials
%windir%\System32\inetsrv\appcmd stop site /site.name:C2-Testing.Servicio.CPFinancials
%windir%\System32\inetsrv\appcmd stop apppool /apppool.name:C2-Testing.Servicio.FacturaElectronica
%windir%\System32\inetsrv\appcmd stop site /site.name:C2-Testing.Servicio.FacturaElectronica
%windir%\System32\inetsrv\appcmd stop apppool /apppool.name:C3-Testing.Sistema.Interfaces
%windir%\System32\inetsrv\appcmd stop site /site.name:C3-Testing.Sistema.Interfaces

git fetch origin
git reset --hard origin/main
git clean -fd

%windir%\System32\inetsrv\appcmd start apppool /apppool.name:C1-Testing.Servicio.NeoCore
%windir%\System32\inetsrv\appcmd start site /site.name:C1-Testing.Servicio.NeoCore
%windir%\System32\inetsrv\appcmd start apppool /apppool.name:C2-Testing.Servicio.CPFinancials
%windir%\System32\inetsrv\appcmd start site /site.name:C2-Testing.Servicio.CPFinancials
%windir%\System32\inetsrv\appcmd start apppool /apppool.name:C2-Testing.Servicio.FacturaElectronica
%windir%\System32\inetsrv\appcmd start site /site.name:C2-Testing.Servicio.FacturaElectronica
%windir%\System32\inetsrv\appcmd start apppool /apppool.name:C3-Testing.Sistema.Interfaces
%windir%\System32\inetsrv\appcmd start site /site.name:C3-Testing.Sistema.Interfaces

pause