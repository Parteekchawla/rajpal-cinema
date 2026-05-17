# PowerShell Script to Configure SQL Server Express 2022
# ========================================================
# 1. Enable TCP/IP protocol
# 2. Set Port to 1433
# 3. Enable Mixed Mode Authentication
# 4. Restart SQL Server
# 5. Create SQL user 'rajpal' with password 'rajpal@123'

Write-Host "Configuring SQL Server Express..." -ForegroundColor Cyan

# 1. Enable TCP/IP
try {
    $tcp = Get-WmiObject -Namespace 'root\Microsoft\SqlServer\ComputerManagement16' -Class 'ServerNetworkProtocol' | 
           Where-Object { $_.ProtocolName -eq 'Tcp' -and $_.InstanceName -eq 'SQLEXPRESS' }
    if ($tcp) {
        $tcp.SetEnable()
        Write-Host "TCP/IP Protocol Enabled." -ForegroundColor Green
    } else {
        Write-Warning "TCP/IP Protocol WMI object not found for instance SQLEXPRESS."
    }
} catch {
    Write-Error "Failed to enable TCP/IP protocol: $_"
}

# 2. Set TCP Port to 1433 for all IP addresses
try {
    # Set ListenAll to Yes (1)
    $tcpProps = Get-WmiObject -Namespace 'root\Microsoft\SqlServer\ComputerManagement16' -Class 'ServerNetworkProtocolProperty' |
                Where-Object { $_.ProtocolName -eq 'Tcp' -and $_.InstanceName -eq 'SQLEXPRESS' }
    
    $listenAll = $tcpProps | Where-Object { $_.PropertyName -eq 'ListenOnAllIPs' }
    if ($listenAll) {
        $listenAll.SetValue(1)
    }

    # Set Port to 1433
    $ports = Get-WmiObject -Namespace 'root\Microsoft\SqlServer\ComputerManagement16' -Class 'ServerNetworkProtocolProperty' |
             Where-Object { $_.ProtocolName -eq 'Tcp' -and $_.InstanceName -eq 'SQLEXPRESS' -and $_.PropertyName -eq 'Port' }
    
    foreach ($p in $ports) {
        $p.SetValue("1433")
    }
    
    # Also set TCP Port under IPAll
    $tcpAddresses = Get-WmiObject -Namespace 'root\Microsoft\SqlServer\ComputerManagement16' -Class 'ServerIPAddressProperty' |
                    Where-Object { $_.ProtocolName -eq 'Tcp' -and $_.InstanceName -eq 'SQLEXPRESS' -and $_.PropertyName -eq 'TcpPort' }
    foreach ($addr in $tcpAddresses) {
        $addr.SetValue("1433")
    }
    
    Write-Host "TCP Port set to 1433." -ForegroundColor Green
} catch {
    Write-Error "Failed to configure TCP Port: $_"
}

# 3. Enable Mixed Mode Authentication (Registry)
try {
    $regPath = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQLServer"
    if (Test-Path $regPath) {
        Set-ItemProperty -Path $regPath -Name "LoginMode" -Value 2
        Write-Host "SQL Server Mixed Mode Authentication Enabled." -ForegroundColor Green
    } else {
        Write-Warning "Registry path for SQL Server 2022 Express not found."
    }
} catch {
    Write-Error "Failed to enable Mixed Mode: $_"
}

# 4. Restart SQL Server Service
Write-Host "Restarting SQL Server service (MSSQL`$SQLEXPRESS)..." -ForegroundColor Cyan
try {
    Restart-Service -Name "MSSQL`$SQLEXPRESS" -Force -ErrorAction Stop
    Write-Host "SQL Server Service Restarted Successfully." -ForegroundColor Green
} catch {
    Write-Error "Failed to restart SQL Server service: $_"
}

# 5. Create SQL user 'rajpal'
Write-Host "Creating SQL Login 'rajpal'..." -ForegroundColor Cyan
try {
    $sqlCmd = @"
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'rajpal')
BEGIN
    CREATE LOGIN [rajpal] WITH PASSWORD = 'rajpal@123', DEFAULT_DATABASE = [RajpalVista], CHECK_POLICY = OFF;
END
USE [RajpalVista];
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'rajpal')
BEGIN
    CREATE USER [rajpal] FOR LOGIN [rajpal];
    ALTER ROLE [db_owner] ADD MEMBER [rajpal];
END
ALTER LOGIN [sa] ENABLE;
"@
    sqlcmd -S 'localhost\SQLEXPRESS' -Q $sqlCmd
    Write-Host "SQL User 'rajpal' created and configured successfully!" -ForegroundColor Green
} catch {
    Write-Error "Failed to create SQL user: $_"
}

Write-Host "SQL Server Express Configuration Complete!" -ForegroundColor Green
