# escape=`

FROM mcr.microsoft.com/windows/servercore:ltsc2019

SHELL ["powershell"]

WORKDIR C:\devel\mattdelsordo.github.io

# install choco and utilities
RUN Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
RUN choco install git.install -y; `
    choco install nano -y; 

# configure git
RUN git config --global user.email "mattdelsordo@gmail.com"; `
    git config --global user.name "Matt DelSordo"; `
    git config --global core.editor nano;

ENTRYPOINT powershell
