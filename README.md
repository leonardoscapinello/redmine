# Redmine Integration

O Redmine Integration é uma aplicação que funciona como ponto entre duas outras aplicações, elas: SysAid (https://sysaid.com) e Redmine (https://redmine.org).

A integração permite abrir uma *Issue* no *Redmine*, a partir de um *Registro de Serviço* no *SysAid*, qual devem estar relacionados via código único de identificação gerado ao registrar uma *Issue*.

Outra função é um *Scheduler* que executa de tempo em tempo (de acordo com o determinado), buscando atualizações no chamado do *Redmine* e levando-as aos chamados do *SysAid*.



## Instalação

> **Nota:** Execute os comandos abaixo utilizando prompt de comando padrão de Windows, com privilégios de Administrador.

Crie uma pasta denominada "**redmine**" no *C:*

    mkdir C:\redmine

Entre na pasta

    cd C:\redmine

Inicie o git dentro do repositório criado

    git init
 
Logo na sequência, clonae o diretório online para a máquina local:

    git clone https://github.com/leonardoscapinello/redmine.git

Instale o gerenciador de pacote *Yarn*  *(yarn-1.17.3.msi)*, executando o comando abaixo:

    msiexec /a "C:\redmine\readme\yarn-1.17.3.msi"

Instale a aplicação

    yarn init




## Configurações

#### SysAid Properties

Edite o arquivo: `C:\redmine\src\config\sysaid.js`

|Propriedade  | Esperado | Padrão |
|--|--|--|
| cookie | nome do cookie de retorno da aplicação | JSESSIONID
| *server*.main | **endereço raiz da aplicação** | http://167.86.91.120:8081
| *server*.login | endereço da api para autenticação | /api/v1/login
| *server*.sr | endereço da api para retorno dos registros de serviços | /api/v1/sr
| *server*.login | endereço da api para retorno dos usuários | /api/v1/users
| *queryParams*.fields | parametros GET para filtro dos campos e chamados que devem ser retornados pela consulta | ?fields=title,description,<br>problem_type,<br>problem_sub_type,<br>third_level_category,<br>insert_time,close_time,<br>assigned_group,status,<br>CustomColumn6sr,<br>request_user,priority,notes,<br>cust_notes&assigned_group=1
| user_name | usuário administrador para autenticação | .\\sysaid |
| password | senha do usuário administrador para autenticação | - |
| fields.issueId | nome do atributo no SysAid que receberá o id da Issue de integração | CustomColumn6sr |
| fields.issueIdDatabase | nome da coluna no banco de dados que receberá o id da Issue de integração | sr_cust_redmine_id |


#### Redmine Properties

Edite o arquivo: `C:\redmine\src\config\redmine.js`

|Propriedade  | Esperado | Padrão |
|--|--|--|
| api_key | chave de autenticação na API do Redmine | af9ea359529a2ca62f6c2a5cbb2cc17288f23822
| server | URL da aplicação | https://servicedesk.ebs-it.services
| username | Usuário de autenticação | `@Deprecated on Redmine Integration`
| password | Senha de autenticação | `@Deprecated on Redmine Integration`
| filters | Parâmetros GET para consulta de chamados  | ?status_id=closed

#### Scheduler Properties

Edite o arquivo: `C:\redmine\src\config\scheduler.js`

|Propriedade  | Esperado | Padrão |
|--|--|--|
| timer.minutes | valor inteiro em minutos para execução do Scheduler  | 60


#### Authentication Properties

Edite o arquivo: `C:\redmine\src\config\auth.js`

|Propriedade  | Esperado | Padrão |
|--|--|--|
| secret | Chave de autenticação na aplicação Redmine Integration  | 60
| expiresIn | Tempo em String **n**d de expiração, ex: 7d para 7 dias  | `@Deprecated on Redmine Integration`
| serverPort | número para execução da api do Redmine Integration  | 3031




## Iniciando a aplicação

#### Instalando o Serviço do Windows

No prompt de comando, como Administrador, digite o comando abaixo

    cd C:\redmine

Instale o serviço do Redmine para Windows

    yarn redmine-install-service

Para remover o serviço, ao invés, execute o comando: `yarn redmine-unistall-service`

#### Para iniciar sem intervenção de um serviço do Windows

No prompt de comando, como Administrador, digite o comando abaixo

    cd C:\redmine

Abra o prompt de comando e execute a linha abaixo:

    yarn redmine

#####  A aplicação retornará, caso houver sucesso:

    *  Starting Scheduler on {dia}/{mês}/{ano} {hira}:{minuto}:{segundo}
    └─ Scheduler timer is set to {timer.minutes} minute(s)
    Application running on {application.port}
    
#####  Caso houver autenticação bem sucedida com o SysAid:

    Successfully Authenticated on SysAid


## Application Programming Interface (API)

>  Neste documento apenas consta as interfaces de consulta externa.



#### SysAid

| Rota  | Método  | Parâmetros|  Retorno |
|--|--|--|--|
| /sysaid  | GET | - | Todos os chamados integráveis
| /sysaid/:id  | GET | {id} - id do chamado no SysAid | Único chamado baseado no ID

#### Redmine Integration

| Rota  | Método  | Parâmetros|  Retorno |
|--|--|--|--|
| /redmine/:id | POST | {id} - id do chamado no SysAid | Registrar *Issue* no redmine de acordo com as informações obtidas do *Registro de Serviço do SysAid* e relaciona-os via ID.
